const db = require("quick.db");



// неделю/месяц/год/всё время
function getStatContact(userLogin, time) {
    const contacts = db.get(".contacts").filter((element)=> element.author===userLogin && element);

    if(time==="week"){
        contacts
    }
    else if(time){
        return contacts.filter((element)=> element.timeshtamp.includes(time) && element).length;
    }
    else return contacts.length;
}


function getStatLids(userLogin, time) {
    const lids = db.get(".lids").filter((element)=> element.author===userLogin && element);

    if(time){
        return lids.filter((element)=> element.timeshtamp.includes(time) && element).length;
    }
    else return lids.length;
}