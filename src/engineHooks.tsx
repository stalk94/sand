import globalState from "./global.state";
import { convertArrayToCSV } from "convert-array-to-csv";

/**
 * Левая панель инструментов. Удобно использовать в useEffect
 * @param children элементы которые мы хотим отобразить. Если ничего не передается в аргумент то панель не показываеться
 */
export function useToolbar(children: JSX.Element | string | undefined) {
    EVENT.emit("toolbar", children);
}


/**
 * Хук вызывает всплывающее окно внизу. 
 * @param type тип окна, меняет цвет
 * @param title заголовок к примеру "Внимание"
 * @param text
 */
export function useInfoToolbar(type: "error"|"sucess"|"warn", title: string, text:string) {
    const detail = {
        type: type,
        title: title,
        text: text
    }

    EVENT.emit("infoPanel", detail);
}


/**
 * 
 * @param url 
 * @param data 
 * @param callback 
 */
export function fetchApi(url: string, data: any, callback: Function) {
    if(url && globalState.user) {
        let call = callback;
        if(url==="addTodo" || url==="readTodo" || url==="delTodo"){
            call =(data)=> {
                if(data.error) useInfoToolbar("error", "Error", data.error);
                else globalState.user.todo.set(data);
                if(callback) callback(data);
            }  
        }

        send(url, {login: globalState.user.login.get(), token: globalState.user.token.get(), ...data})
            .then(call);
    }
}


export function loadToCsv(data:[]) {
    let a = document.createElement("a");
    let file = new Blob([convertArrayToCSV(data)], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "contact.csv";
    a.click();
}