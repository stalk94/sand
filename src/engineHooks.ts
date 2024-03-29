import globalState from "./global.state";
import { convertArrayToCSV } from "convert-array-to-csv";
import { parse } from "papaparse";
import _ from "lodash";


/**
 * Левая панель инструментов. Удобно использовать в useEffect
 * @param children элементы которые мы хотим отобразить. Если ничего не передается в аргумент то панель не показываеться
 */
export function useToolbar(children?:JSX.Element|string) {
    EVENT.emit("toolbar", children);
}

/**
 * Хук вызывает всплывающее окно внизу. 
 * @param type тип окна, меняет цвет
 * @param title заголовок к примеру "Внимание"
 * @param text
 */
export function useInfoToolbar(type:"error"|"sucess"|"warn", title:string, text:string) {
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
export function fetchApi(url:string, data:any, callback?:Function) {
    if(url && globalState.user) {
        let call = callback;
        if(url==="addColumn" || url==="readTodo" || url==="delTodo"){
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
export function loadToCsv(data:Array<object>) {
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
export function csvToJson(data:string, toObj?:boolean): object|[]|void {
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
export function encodeImageFileAsURL(callback:Function) {
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


/**
 * Получить сетку календаря
 * @param year год
 * @param month номер месяца, начиная с 0 (январь)
 * @returns array chunk
 */
export function getDays(year:number, month:number): Array<Array<{day:number,weeknumber:number,dayname:string}>> {
    const days = [];
    const d = new Date(year, month, 1);
    let ned = 1;

    const dayFillGrid =(arr)=> {
        const days = ["пн","вт","ср","чт","пт","сб","вс"];
        let prewIndex = null;
        let lastIndex = null;
        days.forEach((elem, index)=> {
            if(elem===arr[0].dayname) prewIndex = index;
        });
        days.forEach((elem, index)=> {
            if(elem===arr[arr.length-1].dayname) lastIndex = index;
        });
        
        return [...Array(prewIndex).fill(null), ...arr, ...Array(6-lastIndex).fill(null)];
    }
    const getWeek =()=> {
        const name = d.toLocaleString('ru-RU', { weekday: 'short' });
        if(name==="вс") ned++;
        return ned;
    }
  
    while(d.getMonth()===month) {
        const date = d.getDate();
  
        days.push({
            day: date,
            weeknumber: getWeek(),
            dayname: d.toLocaleString('ru-RU', { weekday: 'short' })
        });
  
        d.setDate(date + 1);
    }
  
    
    return _.chunk(dayFillGrid(days), 7);
}


/**
 * Отфильтрует контакты по автору и времени создания
 * @param userLogin
 * @param time 
 * @returns 
 */
export function getFilterContact(time?:string, userLogin?:string) {
    let contacts = globalState.contacts.get();
    if(userLogin) contacts = contacts.filter((element)=> element.author===userLogin && element);
   
    if(time && time!==""){
        return contacts.filter((element)=> {
            if(element.timeshtamp.includes(time)) return element;
        });
    }
    else return contacts;
}


/**
 * Отфильтрует лиды по автору и времени создания
 * @param userLogin 
 * @param time 
 * @returns 
 */
export function getFilterLids(time?:string, userLogin?:string) {
    let lids = globalState.lids.get();
    if(userLogin) lids = lids.filter((element)=> element.author===userLogin && element);

    if(time && time!==""){
        return lids.filter((element)=> element.timeshtamp.includes(time) && element);
    }
    else return lids;
}


export function getUseTime(date:Array<number|string>): string {
    const month = ["не выбрано","январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];
    
    let curmonth = '.0';
    month.forEach((elem, index)=> {
        if(elem===date[0]){
            if(index < 10) curmonth = `.0${index}`;
            else curmonth = '.'+index.toString();
        }
    });

    let time = "";
    if(date[0]!=="не выбрано") time = curmonth;
    if(date[1]!=="не выбрано") time = time + `.${date[1]}`;
    return time;
}


export function getMemory(): void {
    const formatMemoryUsage =(data)=> `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
    console.log(`
        totalHeap: ${formatMemoryUsage(window.performance.memory.totalJSHeapSize)}
        usedHeap: ${formatMemoryUsage(window.performance.memory.usedJSHeapSize)}
    `)
}