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
app.post('/getTodo', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        res.send(user.todo);
    }
});
app.post('/addColumn', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(req.body.column){
            req.body.column.id = user.todo.column.length + 1;
            req.body.column.cards = [];
            user.todo.column.push(req.body.column);
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/delColumn', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
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
app.post('/swapColumns', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
        if(req.body.first && req.body.second){
            user.todo.column[req.body.first - 1].id = req.body.second;
            user.todo.column[req.body.second - 1].id = req.body.first;
            [user.todo.column[req.body.first - 1], user.todo.column[req.body.second - 1]] = [user.todo.column[req.body.second - 1], user.todo.column[req.body.first - 1]]
            db.set("users."+req.body.login, user);
        }
        res.send(user.todo);
    }
});
app.post('/addCard', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
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
app.post('/delCard', (req, res)=> {
    const verifu = authVerifuToken(req.body.login, req.body.token);
    
    if(verifu.error && prod!=="false") res.send(verifu);
    else {
        const user = db.get("users."+req.body.login);
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



//db.set("contacts", []);
// db.set("users.test.todo", {column:[]});
app.use('/', express.static(path.join(__dirname, '/dist')));
server.listen(3000, ()=> console.log("start 3000"));