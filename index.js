require("./server/dom");
const http = require('http');
const express = require('express');
const cors = require("cors");
const path = require("path");
const agent = require("./server/agent")


const app = express();
app.use(cors({origin:"http://localhost:3001"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const server = http.createServer(app);


app.get("/", (req, res)=> {
    res.sendFile(__dirname+'/dist/index.html');
});
app.post("/test", (req, res)=> {
    console.log(req.query)
});


app.use('/', express.static(path.join(__dirname, '/dist')));
server.listen(3000, ()=> console.log("start 3000"));