import React from "react";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useDidMount, useWillUnmount } from 'rooks';
import { useInfoToolbar, fetchApi, useToolbar } from "../engineHooks";
import "../style/modal.css";



export function ModalEventCalendar() {
    const [value, setValue] = React.useState(false);
    const [date, setDate] = React.useState([]);
    const [events, setEvents] = React.useState([]);

    const useCreateEvent =(newEvent)=> {
        fetchApi("addEvent", {date:{year:date[0],month:date[1]}, event:newEvent}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else EVENT.emit("eventUpdate", res);
        });
    }
    const eventOn =(obj)=> {
        setEvents(obj.events);
        setDate(obj.date);
        setValue(true);
    }
    useDidMount(()=> EVENT.on("clickCell", eventOn));
    useWillUnmount(()=> EVENT.off("clickCell", eventOn));


    return(
        <div className="modalContainer" style={{display:value?"":"none"}}>
            
        </div>
    );
}