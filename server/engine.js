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
    return memoryUsage;
}


exports.authVerifuToken =async(login, token)=> {
    if(login && token){
        let user = await db.get("users."+login);
        if(user && user.token && user.token===token) {
            db.set("users."+login+'.online', true);
            delete user.password;
            return user;
        }
        else {
            logger.error(`🔐 Ошибка проверки токена пользователя ${login}, error tokenVerifu lvl 2`);
            return {error: "В доступе отказано invalid token"};
        }
    }
    else {
        logger.error(`🔐 Ошибка проверки токена пользователя ${login}, error tokenVerifu lvl 1`);
        return {error: "В доступе отказано"};
    }
}
exports.authVerifu =async(login, password)=> {
    if(login && password){
        let user = await db.get("users."+login);
        if(user && user.password===password) {
            user.token = CryptoJS.AES.encrypt(new Date().getTime().toString(), 'test').toString();
            user.online = true;
            await db.set("users."+login, user);
            delete user.password;
            return user;
        }
        else {
            logger.error(`🔐 Ошибка авторизации пользователя ${login}, error authVerifu lvl 2`);
            return {error: "error password or login"};
        }
    }
    else {
        logger.error(`🔐 Ошибка авторизации пользователя ${login}, error authVerifu lvl 1`);
        return {error: "В доступе отказано invalid login or password"};
    }
}
exports.createUser =async(login, pass, permision, color, author)=> {
    const user = await db.get("users."+author);

    if(user.permision!==0) return {error:"not permision"};
    if(pass.length < 6 && pass.length > 35) return {error:"password minimum 6 simbol, max 35"};
    if(login.length < 5 && login.length > 22) return {error:"login minimum 5 simbol, max 22"};
    else {
        const newUser = await db.get("users."+login);
        if(newUser) {
            logger.error(`📝 Ошибка регистрации нового пользователя ${login}, имя пользователя уже зарегистрированно в системе.`);
            return {error:"пользователь с таким логином уже зарегестрирован"};
        }
        else {
            await db.set("users."+login, {
                login: login,
                password: pass,
                token: "",
                id: Object.keys(db.get("users")).length + 1,
                intervalLoad: 7000,
                online: false,
                avatar: undefined,
                massage: [],
                permision: permision,
                color: "#"+color,
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

    if(msg.length < 3 && msg.length > 700) return {error:"masssage min 3 simbol max 700 simbol"};
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
    else return {error:"recipient not find"}
}



exports.db = db;