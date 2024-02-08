import React from "react";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useDidMount, useWillUnmount } from 'rooks';
import { useInfoToolbar, fetchApi, useToolbar } from "../engineHooks";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import "../style/modal.css";



export function ModalAddEvent() {
    const users = useHookstate(globalState.users);
    const [view, setView] = React.useState(false);
    const [date, setDate] = React.useState([]);

    const useCreateEvent =(newEvent)=> {
        fetchApi("addEvent", {date:{year:date[0],month:date[1]}, event:newEvent}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else EVENT.emit("eventUpdate", res);
        });
    }
    const eventOn =(obj)=> {
        setDate(obj.date);
        setView(true);
    }
    useDidMount(()=> EVENT.on("clickCell", eventOn));
    useWillUnmount(()=> EVENT.off("clickCell", eventOn));
    

    return(
        <div className="modalContainer" style={{display:view||test?"":"none"}}>
            <Card 
                title={<div></div>}
                footer={
                    <span>
                        <Button label="Add event" icon="pi pi-check" className="p-button-success" style={{marginRight:'20px'}}/>
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
        fetchApi("delEvent", {date:{year:date[0],month:date[1]}, event:event}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else EVENT.emit("eventUpdate", res);
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
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger" style={{marginRight:'20px'}}/>
                        <Button onClick={()=> setView(false)} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                    </span>
                }
            >
                {event.content.text}
            </Card>
        </div>
    );
}