const { db } = require("./engine");


db.set('logs', {
    error: [],
    warn: [],
    info: []
});
db.set('contacts', []);
db.set('users', {
    admin: {
        login: "admin",
        token: "",
        password: 'admin',
        id: 0,
        intervalLoad: 7000,
        online: true,
        avatar: undefined,
        massage: [],
        permision: 0,
        color: 'red',
        todo: {
            column: []
        }
    }
});
db.set('lids', []);
db.set('calendar', {});
db.set('cooper', 'new company');