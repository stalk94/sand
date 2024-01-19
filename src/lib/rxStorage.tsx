import EventEmmitter from "./emiter";


interface RxStorage {
	globalStorage: {},
	_event: EventEmmitter,
	init(globalStorage: object): RxStorage ,
	set(key: string, value: any): RxStorage,
	get(key: string): any,
	watch(key: string, listener: Function): void,
	unwatch(key: string): void
}


export const useLocalStorage =()=> {
    const result = {}

    Object.keys(localStorage).map((key)=> {
        if(key!=='setItem' && key!=='getItem' && key!=='removeItem'){
			result[key] = JSON.parse(localStorage.getItem(key))
		}
    });

	return result;
}



export default {
    globalStorage: {},
	_event: new EventEmmitter(),
    
	async _save(key, value) {
		localStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * Инициалтзатор реактивного хранилища
	 * @param globalStorage обьект хранилища
	 * @returns this
	 */
    init(globalStorage: object): RxStorage  {
        this.globalStorage = globalStorage;
        return this;
    },
	set(key: string, value: any): RxStorage  {
		this.globalStorage[key] = value;
		this._save(key, value);
		this._event.emit(key, value);

		return this;
	},
	get(key: string): any {
		return this.globalStorage[key];
	},
	watch(key: string, listener: Function) {
		this._event.on(key, listener);
	},
	unwatch(key: string) {
		delete this._event.events[key];
	}
}