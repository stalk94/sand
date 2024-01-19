const db = require("quick.db");
const CryptoJS = require('crypto-js');


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
        else return {error: "error password"};
    }
    else return {error: "В доступе отказано invalid login or password"}
}
