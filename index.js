require("./server/dom");
const http = require('http');
const express = require('express');
const cors = require("cors");
const path = require("path");
const db = require("quick.db");


const app = express();
app.use(cors({origin:"http://localhost:3001"}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const server = http.createServer(app);


app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/dist/index.html');
});
app.post('/readContact', (req, res)=> {
    const cont = db.get("contacts");
    if(cont[req.body.id]){
        if(req.body.telephone) cont[req.body.id].telephone = req.body.telephone;
        else if(req.body.name) cont[req.body.id].name = req.body.name;
        db.set("contacts", cont);
    }
    res.send(cont);
});
app.post('/addContact', (req, res)=> {
    const cont = db.get("contacts");
    if(cont[req.body]){
        cont.push(req.body);
        db.set("contacts", cont);
    }
    res.send(cont);
})
app.post('/delContact', (req, res)=> {
    const cont = db.get("contacts");
    if(cont[req.body.id]){
        cont.splice(req.body.id, 1);
        db.set("contacts", cont);
    }
    res.send(cont);
});



app.use('/', express.static(path.join(__dirname, '/dist')));
server.listen(3000, ()=> console.log("start 3000"));