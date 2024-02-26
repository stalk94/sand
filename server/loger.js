const { db } = require("./engine");


const getMonth =()=> {
    const month = new Date().getMonth();
    if(month+1 < 9) return `0${month+1}`;
    else return month+1;
}


globalThis.logger = {
    error(text, type) {
        db.push('logs.error', {
            type: type ?? 'standart',
            msg: text,
            timeshtamp: {
                data: new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear(),
                time: new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds(),
            }
        });
    },
    warn(text) {
        db.push('logs.warn', {
            msg: text,
            timeshtamp: {
                data: new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear(),
                time: new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds(),
            }
        });
    },
    info(text) {
        db.push('logs.info', {
            msg: text,
            timeshtamp: {
                data: new Date().getDate()+"."+getMonth()+"."+new Date().getFullYear(),
                time: new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds(),
            }
        });
    },
    async getLogs(type) {
        return await db.get('logs.'+type);
    }
};



process.on("uncaughtException", (err)=> logger.error(err, 'system crash'));