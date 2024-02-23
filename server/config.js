const { db } = require("./engine");


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


db.set('users.test', {
    login: "test",
    token: "",
    password: 'test',
    id: 0,
    online: true,
    avatar: undefined,
    massage: [{
        text: `DataTable responsive layout can be achieved in two ways; first approach `,
        author: "test",
        timeshtamp: new Date().getDate()+"."+new Date().getMonth()+"."+new Date().getFullYear(),
        view: false
    }],
    permision: 0,
    color: 'red',
    todo: {
        column: []
    }
});