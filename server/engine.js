const CryptoJS = require('crypto-js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();


const getMonth =()=> {
    const month = new Date().getMonth();
    if(month+1 < 9) return `0${month+1}`;
    else return month+1;
}
const getTime =()=> {
    return new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
}


exports.authVerifuToken =async(login, token)=> {
    if(login && token){
        let user = await db.get("users."+login);
        delete user.password;

        if(user && user.token && user.token===token) return user;
        else return {error: "В доступе отказано invalid token"};
    }
    else return {error: "В доступе отказано"}
}
exports.authVerifu =async(login, password)=> {
    if(login && password){
        let user = await db.get("users."+login);
        if(user && user.password===password) {
            user.token = CryptoJS.AES.encrypt(new Date().getTime().toString(), 'test').toString();
            await db.set("users."+login, user);
            delete user.password;
            return user;
        }
        else return {error: "error password or login"};
    }
    else return {error: "В доступе отказано invalid login or password"}
}
exports.createUser =async(login, pass, permision, author)=> {
    const user = await db.get("users."+author);

    if(user.permision!==0) return {error:"not permision"};
    if(pass.length < 6) return {error:"password minimum 6 simbol"};
    if(login.length < 5) return {error:"login minimum 5 simbol"};
    else {
        const newUser = await db.get("users."+login);
        if(newUser) return {error:"пользователь с таким логином уже зарегестрирован"};
        else {
            await db.set("users."+login, {
                login: login,
                password: pass,
                token: "",
                id: Object.keys(db.get("users")).length + 1,
                online: false,
                avatar: undefined,
                massage: [],
                permision: permision,
                color: "#"+Math.floor(Math.random()*16777215).toString(16),
                todo: {
                    column: []
                }
            });
            return {};
        }
    }
}
exports.sendMail =async(login, msg, author)=> {
    const user = await db.get("users."+login);

    if(msg.length<3 && msg.length>700) return {error:"masssage min 3 simbol max 700 simbol"};
    if(user){
        user.massage.unshift({
            id: user.massage.length + 1,
            text: msg,
            author: author,
            timeshtamp: new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear()+" "+getTime(),
            view: false
        });
        await db.set("users."+login, user);
        return {}
    }
    else return {error:"user not find"}
}

exports.useMemory =()=> {
    const formatMemoryUsage =(data)=> `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    const memoryData = process.memoryUsage();

    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)}`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)}`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)}`,
        external: `${formatMemoryUsage(memoryData.external)}`,
    };
    console.log(memoryUsage);
}


exports.db = db;