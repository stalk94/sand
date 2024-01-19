const db = require("quick.db");




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