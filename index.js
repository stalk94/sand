//require("./server/dom");
const dotenv = require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require("cors");
const path = require("path");
const db = require("quick.db");
const { authVerifu, authVerifuToken } = require("./server/engine");
require("./server/stat.js");


const prod = process.env.production;
const app = express();
app.use(cors({origin:"http://localhost:3001"}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const server = http.createServer(app);



app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/dist/index.html');
});
app.post('/auth', (req, res)=> {
    const userData = authVerifu(req.body.login, req.body.pass);
    
    if(userData.error) res.send(userData);
    else {
        const users = [];
        Object.values(db.get("users")).forEach((user)=> {
            delete user.password;
            delete user.token;
            users.push(user);
        });

        res.send({
            user: userData,
            contacts: db.get("contacts"),
            lids: db.get("lids"),
            stat: db.get("stat"),
            cooper: db.get("cooper"),
            logo: db.get("logo"),
            users: users
        });
    }
});
app.post('/readPassword', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);

    if(verifu.error) res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(user.password===req.body.old){
            user.password = req.body.password;
            db.set("users."+req.body.login, user);
            res.send("Пароль успешно изменен");
        }
        else res.send({error:"old password not correct"});
    }
});
app.post('/readContact', (req, res)=> {
    const cont = db.get("contacts");
    const verifu = authVerifuToken(req.body.login, req.body.token);

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
app.post('/addContact', (req, res)=> {
    const cont = db.get("contacts");
    const verifu = authVerifuToken(req.body.login, req.body.token);
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
app.post('/delContact', (req, res)=> {
    const cont = db.get("contacts");
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        cont.forEach((elem, index)=> {
            if(elem.id===req.body.id) cont.splice(index, 1);
        });
        db.set("contacts", cont);
        res.send(cont);
    }
});
app.post('/addColumn', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(req.body.column){
            req.body.column.id = user.todo.column.length + 1;
            user.todo.column.push(req.body.column);
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/readTodo', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(req.body.todo){
            user.todo = req.body.todo;
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/addCart', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(req.body.cart){
            user.todo.column.map((column)=> {
                if(column.id===req.body.parentId){
                    req.body.cart.id = column.cart.length + 1;
                    column.cart.push(req.body.cart);
                }
            });
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post("/getCalendar", (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);

    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const calendar = db.get("calendar."+req.body.year+":"+req.body.month);
        if(calendar) res.send(calendar);
        else res.send([]);
    }
});
app.post('/addEvent', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const date = req.body.date;
        const events = db.get(`calendar.${date.year}:${date.month}`);
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
app.post('/delEvent', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const date = req.body.date;
        const events = db.get(`calendar.${date.year}:${date.month}`);
        events.forEach((ev, index)=> {
            if(ev.day===req.body.event.day && ev.id===req.body.event.id) events.splice(index, 1);
        });
        db.set(`calendar.${date.year}:${date.month}`, events);

        res.send({sucess: "Задание удалено"});
    }
});
app.post('/addLid', (req, res)=> {
    const lids = db.get("lids");
    const verifu = authVerifuToken(req.body.login, req.body.token);
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


//db.set("contacts", []);
//db.set("users.test.todo", {column:[]});
app.use('/', express.static(path.join(__dirname, '/dist')));
server.listen(3000, ()=> console.log("start 3000"));