const db = require("quick.db");
const xlsx = require("json-as-xlsx");


/**
 * 
 */
exports.Agent = class {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.avatar = data.avatar;
        this.permision = data.permision;
    }
    exit() {
        let data = db.get("agent");
        data[this.id] = this;
        db.set("agent", data);
    }
}

const data = [
    {
        id: 0,
        name: "test",
        timeshtamp: '24.07.2023',
        telephone: "+384940932343",
        category: "важные",
        author: "admin",
        priorety: "star"
    },
    {
        id: 1,
        name: "test",
        timeshtamp: '24.07.2023',
        telephone: "+384940932343",
        category: "важн",
        author: "admin",
        priorety: "star"
    }
]


console.log(xlsx(data))