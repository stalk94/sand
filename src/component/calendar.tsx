import React from "react";
import globalState from "../global.state";
import { EventCalendar, Day } from "../lib/type";
import { ModalEventCalendar, ModalAddEvent } from "./modal.calendar";
import { useInfoToolbar, fetchApi, useToolbar, getDays } from "../engineHooks";
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useDidMount, useWillUnmount } from 'rooks';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "../style/calendar.css";


const testEvent = [{
    id: 0,
    day: 5,
    title: "title test",
    author: "test",
    to: "test",
    content: {
        color: "#2660e8cf",
        text: "..."
    }
}];



export const DateCalendarPicker =({curentDate, useDate})=> {
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
    const useClick =(val:"left"|"right")=> {
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
    const useClickEvent =(eventCur:EventCalendar)=> {
        EVENT.emit("clickEvent", {date:[...date, day.day], event:eventCur});
    }
    const useClickCell:React.MouseEventHandler =(ev)=> {
        if(ev.target.className==="row"||ev.target.className==="eventColumn"){
            EVENT.emit("clickCell", {date:[...date, day.day], events:events});
        }
    }


    return(
        <div className="row" onClick={useClickCell}>
            { day.day }
            <div className="eventColumn" style={{height:"77%"}}>
                {events.map((event:EventCalendar, index:number)=> {
                    return <div className="eventCell"
                        key={index}
                        style={{backgroundColor:event.content.color}}
                        onClick={()=> useClickEvent(event)}
                    >
                        {event.to===globalState.user.login.get()?"💡 "+ event.title : event.title}
                    </div>
                })}
            </div>
        </div>
    );
}
const GridCalendar =({date})=> {
    const [gridData, setGridData] = React.useState(getDays(date[0], date[1]));
    const [data, setData] = React.useState<Array<EventCalendar>>(testEvent);
   
    const getFetchEventData =()=> {
        fetchApi("getCalendar", {year:date[0], month:date[1]}, (res:{error:string}|Array<EventCalendar>)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else setData(res);
        });
    }
    const useEvent =(day:Day)=> {
        const result = [];
        data.forEach((event:EventCalendar)=> {
            if(day.day===event.day) result.push(event);
        });
 
        return result;
    }
    const useFiltre =(req:{type:string})=> {
        if(req.type==="myEvent") setData((events)=> 
            events.filter((ev)=> ev.to===globalState.user.login.get() && ev 
        ));
        else if(req.type==="myCreate") setData((events)=> {
                getFetchEventData();
                return events.filter((ev)=> ev.author===globalState.user.login.get() && ev);
            }
        );
        else if(req.type==="all") getFetchEventData(); 
    }
    useDidMount(()=> {
        EVENT.on("eventUpdate", getFetchEventData);
        EVENT.on("eventFiltre", useFiltre);
    });
    useWillUnmount(()=> {
        EVENT.off("eventUpdate", getFetchEventData);
        EVENT.off("eventFiltre", useFiltre);
    });
    React.useEffect(()=> {
        setGridData(getDays(date[0], date[1]));
        getFetchEventData();
    }, date);
    

    
    return(
        <div style={{display:"grid", width:"100%", height:"100%"}}>
            {gridData.map((chank, index:number)=> {
                return <div key={index} className="base">
                    {chank.map((day:Day, indexDay:number)=> {
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
        const items = [{   
                label: 'Показать все', 
                icon: 'pi pi-align-justify', 
                command:()=> EVENT.emit("eventFiltre", {type:"all"})
            },{   
                label: 'Назначенные мне', 
                icon: 'pi pi-user', 
                command:()=> EVENT.emit("eventFiltre", {type:"myEvent"})
            },{   
                label: 'Созданные мной', 
                icon: 'pi pi-user-plus', 
                command:()=> EVENT.emit("eventFiltre", {type:"myCreate"})
            }
        ];

        useToolbar(<Menu style={{width:"20%"}} model={items}/>);
    });


    return(
        <React.Fragment>
            <ModalEventCalendar />
            <ModalAddEvent />
            <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
                <DateCalendarPicker curentDate={date} useDate={setDate}/>
                <GridWeek/>
                <GridCalendar date={date}/>
            </div>
        </React.Fragment>
    );
}