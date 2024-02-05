import React from "react";
import globalState from "../global.state";
import { useHookstate } from "@hookstate/core";
import { useInfoToolbar, fetchApi, useToolbar } from "../engineHooks";


export function ModalEventCalendar({}) {
    const [value, setValue] = React.useState(false);
    const [view, setView] = React.useState();

    const useCreateEvent =()=> {
        
    }
    useDidMount(()=> {
        EVENT.on("clickCell", (obj)=> {
            setValue(true);
        });
    });

    return(
        <div style={{display:value?"":"none"}}>
            { view }
        </div>
    );
}