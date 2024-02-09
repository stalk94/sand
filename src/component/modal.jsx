import React from "react";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useDidMount, useWillUnmount } from 'rooks';
import { useInfoToolbar, fetchApi } from "../engineHooks";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import "../style/modal.css";



export function ModalAddEvent() {
    const colors = ['red', 'green'];
    const users = useHookstate(globalState.users);
    const [view, setView] = React.useState(false);
    const [date, setDate] = React.useState([]);
    const [color, setColor] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [text, setText] = React.useState("");
    const [to, setTo] = React.useState("");

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
    const eventOn =(obj)=> {
        setDate(obj.date);
        setView(true);
    }
    const useDataInput =(ev)=> {
        if(ev.target.name==="to") setTo(ev.value);
        else if(ev.target.name==="title") setTitle(ev.target.value);
        else if(ev.target.name==="text") setText(ev.target.value);
        else setColor(ev.value);
    }
    const getUserName =()=> {

    }
    useDidMount(()=> EVENT.on("clickCell", eventOn));
    useWillUnmount(()=> EVENT.off("clickCell", eventOn));
    

    return(
        <div className="modalContainer" style={{display:view?"":"none"}}>
            <Card 
                title={
                    <div className="column">
                        <InputText name="title" value={title} onChange={useDataInput} placeholder='title'/>
                        <Dropdown name="to" value={to} onChange={useDataInput} options={colors}/>
                        <Dropdown name="color" value={color} onChange={useDataInput} options={colors}/>
                        <InputText name="text" value={text} onChange={useDataInput} placeholder='text'/>
                    </div>
                }
                footer={
                    <span>
                        <Button onClick={useCreateEvent} label="Add event" icon="pi pi-check" className="p-button-success" style={{marginRight:'20px'}}/>
                        <Button onClick={()=> setView(false)} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                    </span>
                }
            >
            </Card>
        </div>
    );
}


export function ModalEventCalendar({test}) {
    const [view, setView] = React.useState(false);
    const [date, setDate] = React.useState([]);
    const [event, setEvent] = React.useState({
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
    const eventOn =(obj)=> {
        setEvent(obj.event);
        setDate(obj.date);
        setView(true);
    }
    useDidMount(()=> EVENT.on("clickEvent", eventOn));
    useWillUnmount(()=> EVENT.off("clickEvent", eventOn));


    return(
        <div className="modalContainer" style={{display:view||test?"":"none"}}>
            <Card 
                title={<div style={{color:event.content.color}}>{event.title}</div>}
                subTitle={
                    <>
                        <div>{"исполнитель: "+(event.to??"все")}</div>
                        <div>{"автор: "+event.author}</div>
                    </>
                }
                footer={
                    <span>
                        <Button onClick={useDelEvent} label="Delete" icon="pi pi-trash" className="p-button-danger" style={{marginRight:'20px'}}/>
                        <Button onClick={()=> setView(false)} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                    </span>
                }
            >
                {event.content.text}
            </Card>
        </div>
    );
}