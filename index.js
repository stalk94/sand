require("./server/loger");
const dotenv = require('dotenv').config();
const fs = require("fs");
const http = require('http');
const express = require('express');
const cors = require("cors");
const path = require("path");
const { authVerifu, authVerifuToken, createUser, sendMail, db, useMemory } = require("./server/engine");


const prod = process.env.production;
const app = express();
app.use(cors({origin:"http://localhost:3001"}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
const server = http.createServer(app);



app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/dist/index.html');
});
app.post('/auth', async(req, res)=> {
    const userData = await authVerifu(req.body.login, req.body.pass);
    
    if(userData.error) res.send(userData);
    else {
        const bdUsers = await db.get("users");
        const users = [];
        Object.values(bdUsers).forEach((user)=> {
            delete user.password;
            delete user.token;
            users.push(user);
        });

        res.send({
            user: userData,
            contacts: await db.get("contacts"),
            lids: await db.get("lids"),
            cooper: await db.get("cooper"),
            logo: await db.get("logo"),
            users: users
        });
    }
});
app.post('/getState', async(req, res)=> {
    const userData = await authVerifu(req.body.login, req.body.pass);
    
    if(userData.error && prod!=="false") res.send(userData);
    else {
        const bdUsers = await db.get("users");
        const users = [];
        Object.values(bdUsers).forEach((user)=> {
            delete user.password;
            delete user.token;
            users.push(user);
        });

        res.send({
            user: userData,
            contacts: await db.get("contacts"),
            lids: await db.get("lids"),
            cooper: await db.get("cooper"),
            logo: await db.get("logo"),
            users: users
        });
    }
});
app.post('/getLogs', async(req, res)=> {
    const userData = await authVerifu(req.body.login, req.body.pass);
    
    if(userData.error && prod!=="false") res.send(userData);
    else res.send(await logger.getLogs(req.body.type));
});
app.post('/readPassword', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error) res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(user.password===req.body.old){
            user.password = req.body.password;
            await db.set("users."+req.body.login, user);
            res.send("Пароль успешно изменен");
        }
        else res.send({error:"old password not correct"});
    }
});
app.post('/readContact', async(req, res)=> {
    const cont = await db.get("contacts");
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        if(cont[req.body.id]){
            if(req.body.telephone) cont[req.body.id].telephone = req.body.telephone;
            else if(req.body.name) cont[req.body.id].name = req.body.name;
            else if(req.body.category) cont[req.body.id].category = req.body.category;
            db.set("contacts", cont);
        }
        res.send(cont);
    }
});
app.post('/addContact', async(req, res)=> {
    const cont = await db.get("contacts");
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    const getMonth =()=> {
        const month = new Date().getMonth();
        if(month+1 < 9) return `0${month+1}`;
        else return month+1;
    }
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        if(req.body.name){
            delete req.body.token;
            req.body.id = cont.length;
            req.body.author = req.body.login;
            req.body.timeshtamp = new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear();
            cont.push(req.body);
            db.set("contacts", cont);
        }
        res.send(cont);
    }
})
app.post('/delContact', async(req, res)=> {
    const cont = await db.get("contacts");
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        cont.forEach((elem, index)=> {
            if(elem.id===req.body.id) cont.splice(index, 1);
        });
        db.set("contacts", cont);
        res.send(cont);
    }
});

app.post('/swapColumns', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.first && req.body.second){
            user.todo.column[req.body.first - 1].id = req.body.second;
            user.todo.column[req.body.second - 1].id = req.body.first;
            [user.todo.column[req.body.first - 1], user.todo.column[req.body.second - 1]] = [user.todo.column[req.body.second - 1], user.todo.column[req.body.first - 1]]
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/addColumn', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.column){
            req.body.column.id = user.todo.column.length + 1;
            req.body.column.cards = [];
            user.todo.column.push(req.body.column);
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/readTodo', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.todo){
            user.todo = req.body.todo;
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/addCard', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.card){
            user.todo.column.map((column, index)=> {
                if(column.id===req.body.card.parentId){
                    req.body.card.id = new Date().getTime();
                    req.body.card.index = user.todo.column[index].cards.length + 1;
                    column.cards.push(req.body.card);
                }
            });
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/delColumn', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.id){
            user.todo.column.forEach((col, index) => {
                if (col.id === req.body.id) {
                    user.todo.column.splice(index, 1);
                }
            });
            user.todo.column.forEach((col, index) => {
                user.todo.column[index].id = index + 1;
            });
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/delCard', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        if(req.body.card){
            user.todo.column.forEach((column, index)=> {
                if(column.id===req.body.card.parentId){
                    column.cards.forEach((card, indexCard) => {
                        if (card.id === req.body.card.id) {
                            user.todo.column[index].cards.splice(indexCard, 1);
                        }
                    })
                }
            });
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/getTodo', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        res.send(user.todo);
    }
});

app.post("/getCalendar", async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const calendar = await db.get("calendar."+req.body.year+":"+req.body.month);
        if(calendar) res.send(calendar);
        else res.send([]);
    }
});
app.post('/addEvent', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const date = req.body.date;
        const events = await db.get(`calendar.${date.year}:${date.month}`);
        req.body.event.author = req.body.login;

        if(events) {
            req.body.event.id = events.length+1;
            db.set(`calendar.${date.year}:${date.month}`, [...events, req.body.event]);
        }
        else {
            req.body.event.id = 0;
            db.set("calendar."+date.year+":"+date.month, [req.body.event]);
        }

        res.send({sucess: "Добавлено новое задание"});
    }
});
app.post('/delEvent', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const date = req.body.date;
        const events = await db.get(`calendar.${date.year}:${date.month}`);
        events.forEach((ev, index)=> {
            if(ev.day===req.body.event.day && ev.id===req.body.event.id) events.splice(index, 1);
        });
        db.set(`calendar.${date.year}:${date.month}`, events);

        res.send({sucess: "Задание удалено"});
    }
});
app.post('/addLid', async(req, res)=> {
    const lids = await db.get("lids");
    const verifu = await authVerifuToken(req.body.login, req.body.token);
    const getMonth =()=> {
        const month = new Date().getMonth();
        if(month+1 < 9) return `0${month+1}`;
        else return month+1;
    }
    
    if(verifu.error) res.send(verifu);
    else {
        if(req.body.name){
            delete req.body.token;
            req.body.id = lids.length;
            req.body.author = req.body.login;
            req.body.timeshtamp = new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear();
            lids.push(req.body);
            db.set("lids", lids);
        }
        res.send(lids);
    }
});
app.post('/addUser', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const create = await createUser(req.body.userLogin, req.body.password, req.body.permision, req.body.color, req.body.login);
        if(!create.error){
            const usersData = await db.get("users");
            const users = [];
            Object.values(usersData).forEach((user)=> {
                delete user.password;
                delete user.token;
                users.push(user);
            });
            res.send(users);
        }
        else res.send(create);
    }
});
app.post('/sendMail', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const create = await sendMail(req.body.userLogin, req.body.msg, req.body.login);
        if(!create.error) res.send({});
        else res.send(create);
    }
});
app.post('/readStatusMail', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const searchIndex = verifu.massage.findIndex((msg)=> msg.id===req.body.msg.id);
        if(searchIndex!==-1){
            verifu.massage[searchIndex].view = true;
            await db.set(`users.${req.body.login}.massage`, verifu.massage);
            res.send(await db.get(`users.${req.body.login}.massage`));
        }
        else res.send({error:'error index massage'});
    }
});
app.post('/exit', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = await db.get("users."+req.body.login);
        user.online = false;
        db.set('users.'+verifu.login, user);
        res.send(verifu);
        logger.info(req.body.login + ' offline');
    }
});
app.post('/readSettings', async(req, res)=> {
    const verifu = await authVerifuToken(req.body.login, req.body.token);

    if(verifu.error) res.send(verifu);
    else {
        if(req.body.intervalLoad > 1000 && req.body.intervalLoad < 20000) {
            await db.set("users."+req.body.login+".intervalLoad", req.body.intervalLoad);
            verifu.intervalLoad = req.body.intervalLoad;
            res.send(verifu);
        }
    }
});



app.use('/', express.static(path.join(__dirname, '/dist')));
server.listen(3000, ()=> useMemory());