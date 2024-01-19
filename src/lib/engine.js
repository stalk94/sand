import EventEmiter from "./emiter";
import store, { useLocalStorage } from "./rxStorage";


window.gurl = 'http://localhost:3000/';
window.STORE = store.init(useLocalStorage());
window.EVENT = new EventEmiter();

window.send = async function(url, data, metod) {
    let dataServer = {
        method: metod ?? 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if(metod!=='GET') dataServer.body = JSON.stringify(data);

    const request = await fetch(window.gurl + url, dataServer);
    return request.json();
}
