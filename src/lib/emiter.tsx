interface EventNodeJs {
    events: object,
    on(eventName: string, fn: Function): Function,
    emit(eventName: string, data: any): void,
    off(eventName: string, fn: Function): void
}



export default class EventEmmitter implements EventNodeJs {
    events = {}
    on(eventName, fn) {
        if(!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(fn);
        
        return ()=> {
            this.events[eventName] = this.events[eventName].filter((eventFn)=> fn !== eventFn);
        }
    }
    emit(eventName, data) {
        const event = this.events[eventName];
        if(event){
            event.forEach((fn)=> {
                fn.call(null, data);
            });
        }
    }
    off(eventName, fn) {
        if(fn){
            let index = this.events[eventName].findIndex((func)=> func===fn && func);
            if(index) this.events[eventName].splice(index, 1);
        }
        else delete this.events[eventName];
    }
}