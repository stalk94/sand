import EventEmiter from "./emiter";
import store, { useLocalStorage } from "./rxStorage";


globalThis.gurl = 'http://localhost:3000/';
globalThis.STORE = store.init(useLocalStorage());
globalThis.EVENT = new EventEmiter();

globalThis.send = async function(url, data, metod) {
    let dataServer = {
        method: metod ?? 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if(metod!=='GET') dataServer.body = JSON.stringify(data);

    const request = await fetch(gurl + url, dataServer);
    return request.json();
}