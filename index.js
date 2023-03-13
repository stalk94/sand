require("./server/dom");
const http = require('http');
const express = require('express');
const { QuickDB } = require("quick.db");


const app = express();
const server = http.createServer(app);
const bd = new QuickDB();


app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/dist/index.html');
});



server.listen(3000, ()=> console.log("start 3000"));