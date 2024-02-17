const db = require("quick.db");
const CryptoJS = require('crypto-js');


const getMonth =()=> {
    const month = new Date().getMonth();
    if(month+1 < 9) return `0${month+1}`;
    else return month+1;
}
const getTime =()=> {
    return new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
}


exports.authVerifuToken =(login, token)=> {
    if(login && token){
        let user = db.get("users."+login);
        delete user.password;

        if(user && user.token && user.token===token) return user;
        else return {error: "В доступе отказано invalid token"};
    }
    else return {error: "В доступе отказано"}
}
exports.authVerifu =(login, password)=> {
    if(login && password){
        let user = db.get("users."+login);
        if(user && user.password===password) {
            user.token = CryptoJS.AES.encrypt(new Date().getTime().toString(), 'test').toString();
            db.set("users."+login, user);
            delete user.password;
            return user;
        }
        else return {error: "error password or login"};
    }
    else return {error: "В доступе отказано invalid login or password"}
}
exports.createUser =(login, pass, permision, author)=> {
    if(db.get("users."+author).permision!==0) return {error:"not permision"};
    if(pass.length < 6) return {error:"password minimum 6 simbol"};
    if(login.length < 5) return {error:"login minimum 5 simbol"};
    else {
        if(db.get("users."+login)) return {error:"пользователь с таким логином уже зарегестрирован"};
        else {
            db.set("users."+login, {
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
exports.sendMail =(login, msg, author)=> {
    const user = db.get("users."+login);

    if(msg.length<3 && msg.length>700) return {error:"masssage min 3 simbol max 700 simbol"};
    if(user){
        user.massage.push({
            text: msg,
            author: author,
            timeshtamp: new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear()+" "+getTime(),
            view: false
        });
        db.set("users."+login, user);
        return {}
    }
    else return {error:"user not find"}
}
