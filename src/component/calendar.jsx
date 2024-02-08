import React from "react";
import { ModalEventCalendar, ModalAddEvent } from "./modal";
import { useInfoToolbar, fetchApi, useToolbar, getDays } from "../engineHooks";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useDidMount, useWillUnmount } from 'rooks';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "../style/calendar.css"

const testEvent = [{
    id: 0,
    day: 5,
    title: "title test",
    author: "test",
    to: "user",
    content: {
        color: "#f4151585",
        text: "..."
    }
}];



const DateCalendarPicker =({curentDate, useDate})=> {
    const month = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];
    const [arrYear, setArrYear] = React.useState([]);

    useDidMount(()=> {
        const arr = [curentDate[0]];
        for(let i=0; i<6; i++) {
            if(i!==0) arr.push({label:curentDate[0] + i, value:curentDate[0] + i});
        }
        for(let i=0; i<4; i++) {
            if(i!==0) arr.unshift({label:curentDate[0] - i, value:curentDate[0] - i});
        }

        setArrYear(arr);
    });
    const useClick =(val)=> {
        if(val==="left"){
            if(curentDate[1]===0) useDate([curentDate[0]-1, 11]);
            else useDate([curentDate[0], curentDate[1]-1]);
        }
        else {
            if(curentDate[1]===11) useDate([curentDate[0]+1, 0]);
            else useDate([curentDate[0], curentDate[1]+1]);
        }
    }

    return (
        <div className="navBar">
            <Button onClick={()=> useClick("left")} className="p-button-rounded p-button-secondary p-button-outlined" label={<FaAngleLeft/>} />
            <Dropdown style={{marginLeft:"15px"}} value={curentDate[0]} options={arrYear} onChange={(ev)=> useDate([ev.value, curentDate[1]])} />
            <div style={{marginTop:"5px",marginLeft:"15px",marginRight:"15px"}}>
                { month[curentDate[1]] }
            </div>
            <Button onClick={()=> useClick("right")} className="p-button-rounded p-button-secondary p-button-outlined" label={<FaAngleRight/>} />
        </div>
    );
}
const GridWeek =()=> {
    const days = ["пн","вт","ср","чт","пт","сб","вс"];

    return (
        <div className="weeks">
            {days.map((val, index)=> <div key={index} className="week">{val}</div>)}   
        </div>
    );
}
const Cell =({events, day, date})=> {
    const useClickEvent =(eventCur)=> {
        EVENT.emit("clickEvent", {date:date, event:eventCur});
    }
    const useClickCell =(ev)=> {
        if(ev.target.className==="row"||ev.target.className==="eventColumn"){
            EVENT.emit("clickCell", {date:date, events:events});
        }
    }


    return(
        <div className="row" onClick={useClickCell}>
            { day.day }
            <div className="eventColumn" style={{height:"77%"}}>
                {events.map((event, index)=> {
                    return <div className="eventCell"
                        key={index}
                        style={{backgroundColor:event.content.color}}
                        onClick={()=> useClickEvent(event)}
                    >
                        { event.title }
                    </div>
                })}
            </div>
        </div>
    );
}
const GridCalendar =({date})=> {
    const [gridData, setGridData] = React.useState(getDays(date[0], date[1]));
    const [data, setData] = React.useState(testEvent);      // эвенты

   
    const getFetchEventData =()=> {
        fetchApi("getCalendar", {year:date[0], month:date[1]}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else setData(res);
        });
    }
    // промодернизировать для фильтров
    const useEvent =(day)=> {
        const result = [];
        data.forEach((event)=> {
            if(day.day===event.day) result.push(event);
        });

        
        return result;
    }
    useDidMount(()=> EVENT.on("eventUpdate", getFetchEventData));
    useWillUnmount(()=> EVENT.off("eventUpdate", getFetchEventData));
    React.useEffect(()=> {
        setGridData(getDays(date[0], date[1]));
        getFetchEventData();
    }, date);
    

    
    return(
        <div style={{display:"grid", width:"100%", height:"100%"}}>
            {gridData.map((chank, index)=> {
                return <div key={index} className="base">
                    {chank.map((day, indexDay)=> {
                        if(day===null) return <div key={indexDay} className="nullRow"></div>
                        else return <Cell events={useEvent(day)} key={indexDay} date={date} day={day}/>
                    })}
                </div>
            })}
        </div>
    );
}



export default function BaseContainer() {
    const [date, setDate] = React.useState([new Date().getFullYear(), new Date().getMonth()]);

    useDidMount(()=> {
        useToolbar(".");
    });


    return(
        <React.Fragment>
            <ModalEventCalendar/>
            <ModalAddEvent/>
            <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
                <DateCalendarPicker curentDate={date} useDate={setDate}/>
                <GridWeek/>
                <GridCalendar date={date}/>
            </div>
        </React.Fragment>
    );
}