const db = require("quick.db");


db.set("contacts", [{
    id: 0,
    name: "test",
    timeshtamp: '24.07.2023',
    telephone: "+384940932343",
    category: "важные",
    author: "admin",
    data: {}
}]);
db.set("users", [{
    login: "test",
    password: "",
    id: 0,
    theme: "dark",
    avatar: undefined,
    permision: 0,
    todo: {
        column: [{
            id: 0,
            index: 0,
            cards: [{
                index: 0,
                content: {}
            }]
        }]
    }
}]);
db.set("cooper", "newCompany");
db.set("logo", undefined);