import React from "react";
import { EventCalendar, User } from "../lib/type";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useDidMount, useWillUnmount } from 'rooks';
import { useInfoToolbar, fetchApi } from "../engineHooks";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import "../style/modal.css";


const colors = [
    {label: <div style={{color:"#f4151585"}}>Красный</div>, value: "#f4151585"},
    {label: <div style={{color:"#73df26cf"}}>Зеленый</div>, value: "#73df26cf"},
    {label: <div style={{color:"#e7ce0dcf"}}>Ораньжевый</div>, value: "#e7ce0dcf"},
    {label: <div style={{color:"#2660e8cf"}}>Синий</div>, value: "#2660e8cf"}
];


export function ModalAddEvent() {
    const users = useHookstate(globalState.users);
    const [view, setView] = React.useState<boolean>(false);
    const [date, setDate] = React.useState([]);
    const [color, setColor] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [text, setText] = React.useState<string>("");
    const [to, setTo] = React.useState<string>("");

    const useCreateEvent =()=> {
        const newEvent = {
            day: date[2],
            title: title,
            to: to,
            content: {
                color: color,
                text: text
            }
        };
        
        fetchApi("addEvent", {date:{year:date[0],month:date[1]}, event:newEvent}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else {
                useInfoToolbar("sucess", "Успешно", res.sucess);
                EVENT.emit("eventUpdate", res);
                setView(false);
                setColor("");
                setText("");
                setTitle("");
                setTo("");
            }
        });
    }
    const eventOn =(obj:{event:EventCalendar,date:Array<number>})=> {
        setDate(obj.date);
        setView(true);
    }
    const useDataInput:React.ChangeEventHandler =(ev)=> {
        if(ev.target.name==="to") setTo(ev.value);
        else if(ev.target.name==="title") setTitle(ev.target.value);
        else if(ev.target.name==="text") setText(ev.target.value);
        else setColor(ev.value);
    }
    const getUserName =()=> {
        const result = [];
        users.get().forEach((user)=> result.push(user.login));
        return result;
    }
    useDidMount(()=> EVENT.on("clickCell", eventOn));
    useWillUnmount(()=> EVENT.off("clickCell", eventOn));
    

    return(
        <Dialog 
            header="Добавить событие" 
            visible={view} 
            style={{width: '50vw'}} 
            modal 
            onHide={()=> setView(false)}
            footer={
                <span>
                    <Button onClick={useCreateEvent} label="Add event" icon="pi pi-check" className="p-button-success" style={{marginRight:'20px'}}/>
                    <Button onClick={()=> setView(false)} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                </span>
            }
        >
            <div className="column">
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">title</label>
                    <InputText name="title" value={title} onChange={useDataInput}/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">исполнитель</label>
                    <Dropdown name="to" value={to} onChange={useDataInput} options={getUserName()}/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">цвет события</label>
                    <Dropdown name="color" value={color} onChange={useDataInput} options={colors}/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">текст события</label>
                    <InputText name="text" value={text} onChange={useDataInput}/>
                </div>
            </div>
        </Dialog>
    );
}
export function ModalEventCalendar() {
    const [view, setView] = React.useState<boolean>(false);
    const [date, setDate] = React.useState<Array<number>>([]);
    const [event, setEvent] = React.useState<EventCalendar>({
        id: 0,
        day: 5,
        title: "title test",
        author: "test",
        to: "user",
        content: {
            color: "#f4151585",
            text: "..."
        }
    });

    const useDelEvent =()=> {
        fetchApi("delEvent", {date:{year:date[0], month:date[1]}, event:event}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else {
                useInfoToolbar("sucess", "Успешно", res.sucess);
                EVENT.emit("eventUpdate", res);
                setView(false);
            }
        });
    }
    const eventOn =(obj:{event:EventCalendar,date:Array<number>})=> {
        setEvent(obj.event);
        setDate(obj.date);
        setView(true);
    }
    useDidMount(()=> EVENT.on("clickEvent", eventOn));
    useWillUnmount(()=> EVENT.off("clickEvent", eventOn));


    return(
        <Dialog 
            header={<div style={{color:event.content.color,fontSize:"25px"}}>{event.title}</div>} 
            visible={view} 
            style={{width: '50vw'}} 
            modal 
            onHide={()=> setView(false)}
            footer={
                <span>
                    <Button onClick={useDelEvent} label="Delete" icon="pi pi-trash" className="p-button-danger" style={{marginRight:'20px'}}/>
                    <Button onClick={()=> setView(false)} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                </span>
            }
        >
            <div style={{color:"gray"}}>{"исполнитель: "+(event.to??"все")}</div>
            <div style={{color:"gray"}}>{"автор: "+event.author}</div>
            <div style={{marginTop:"5%"}}>{event.content.text}</div>
        </Dialog>
    );
}