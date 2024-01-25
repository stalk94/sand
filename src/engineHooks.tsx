import globalState from "./global.state";
import { convertArrayToCSV } from "convert-array-to-csv";
import { parse } from "papaparse";

/**
 * Левая панель инструментов. Удобно использовать в useEffect
 * @param children элементы которые мы хотим отобразить. Если ничего не передается в аргумент то панель не показываеться
 */
export function useToolbar(children: JSX.Element|string|undefined) {
    EVENT.emit("toolbar", children);
}

/**
 * Хук вызывает всплывающее окно внизу. 
 * @param type тип окна, меняет цвет
 * @param title заголовок к примеру "Внимание"
 * @param text
 */
export function useInfoToolbar(type: "error"|"sucess"|"warn", title: string, text: string) {
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

/**
 * Преобразовует массив в CSV и загружает его на устройство.
 * @param data массив для преобразования
 */
export function loadToCsv(data: []) {
    let a = document.createElement("a");
    let file = new Blob([convertArrayToCSV(data)], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "contact.csv";
    a.click();
}

/**
 * Функция разбирает строку CSV в массив.
 * @param data целевая строка CSV
 * @param toObj разбирать в массив обьектов (true), в массив массивов (false)
 * @returns 
 */
export function csvToJson(data: string, toObj: boolean|undefined): object|[]|void {
    const result = parse(data, {header: toObj??true});
    if(result.errors.length===0) return result.data;
    else useInfoToolbar("error", "Error import", result.errors.join());
}

/**
 * Функция преобразования картинки в строку Base64. 
 * К примеру что бы отправлять на сервер картинки и хранить их базе данных.
 * Вызов функции открывает меню выбора файла для загрузки.
 * @param callback обратный вызов в который передасться строка Base64
 */
export function encodeImageFileAsURL(callback: Function) {
    const element = document.createElement("input");
    element.type = "file";
    element.accept = ".png,.jpg";
    element.onchange =()=> {
        const file = element.files[0];
        const reader = new FileReader();
        reader.onloadend =()=> callback(reader.result);
        reader.readAsDataURL(file);
    }
    element.click();
}