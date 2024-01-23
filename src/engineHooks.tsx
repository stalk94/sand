import globalState from "./global.state";

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
    if(url && globalState.user) send(url, {login: globalState.user.login.get(), token: globalState.user.token.get(), ...data}).then(callback);
}

