import React from "react";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useInfoToolbar, fetchApi, useToolbar, getDays } from "../engineHooks";
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useDidMount } from 'rooks';
import "../style/calendar.css"


const Cell =({index, day})=> {

    return(
        <div className="row"
        >
            { day.day }
        </div>
    );
}
const GridCalendar =({date})=> {
    const [data, setData] = React.useState(getDays(date[0], date[1]));

    React.useEffect(()=> {
        setData(getDays(date[0], date[1]));
    }, date);
    const render =()=> {
        const rend = data.map((chank, index)=> {
            return <div key={index} className="base">
                {chank.map((day, indexDay)=> {
                    if(day===null) return <div key={indexDay} className="nullRow"></div>
                    else return <Cell key={indexDay} day={day}/>
                })}
            </div>
        });

        return rend
    }

    
    return(
        <div style={{display:"grid", width:"100%", height: "100%"}}>
            {render()}
        </div>
    );
}



export default function BaseContainer() {
    const [date, setDate] = React.useState([new Date().getFullYear(), new Date().getMonth()])

    useDidMount(()=> {
        useToolbar();
    });


    return(
        <>
            <GridCalendar date={date}/>
        </>
    );
}