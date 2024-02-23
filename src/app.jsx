import React from 'react';
import globalState from "./global.state";
import { useHookstate } from '@hookstate/core';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import ContactData from "./component/contacts";
import User from "./component/user";
import ToolBar from "./component/toolbar";
import Stat from "./component/stat";
import { useDidMount, useIntervalWhen } from 'rooks';
import { encodeImageFileAsURL, fetchApi, useInfoToolbar, getMemory } from "./engineHooks";
import ToDo from './component/todo';
import Calendar from "./component/calendar";


const navigation = [
    {label:'Контакты', icon:'pi pi-phone'},
    {label:'Лиды', icon:'pi pi-users'},
    {label:'Календарь', icon:'pi pi-fw pi-calendar'},
    {label:'Статистика', icon:'pi pi-chart-bar'},
    {label:'Планировщик', icon:'pi pi-book'}
];


export default function BaseContainer() {
    const state = useHookstate(globalState);
    const [view, setView] = React.useState();
    
    getMemory();
    const useLoadLogo =()=> {
        if(state.user.permision.get()===0) encodeImageFileAsURL((result)=> {
            fetchApi("readBaseCrmData", {logo: result}, (responce)=> {
                if(responce.error) useInfoToolbar("error", "Error", responce.error);
                else state.logo.set(result);
            });
        });
    }
    useDidMount(()=> {
        setView(<User/>);
        document.querySelector(".p-menubar-root-list").addEventListener("click", (ev)=> {
            let target = ev.target.textContent;
            if(target==='Контакты') setView(<ContactData useViev={setView}/>);
            else if(target==='Планировщик') setView(<ToDo />);
            else if(target==="Календарь") setView(<Calendar />);
            else if(target==="Статистика") setView(<Stat/>);
            else if(target==="Лиды") setView();
            else setView();
        });
        
    });
    useIntervalWhen(()=> {
        fetchApi("getState", {}, (res)=> {
            if(res.error) useInfoToolbar("error", "Error", res.error);
            else state.set(res);
        });
    }, state.user.intervalLoad.get() ?? 7000, false);

    
    return(
        <React.Fragment>
            <Menubar 
                model={navigation}
                start={ 
                    <img 
                        width={50} 
                        src={state.logo.get() ?? "https://www.primefaces.org/primereact/images/logo.png"}
                        onClick={useLoadLogo}
                    /> 
                }
                end={ 
                    <Button 
                        onClick={()=> setView(<User />)} 
                        icon="pi pi-user"
                    />
                }
            />
            <div style={{display:"flex",flexDirection:"row"}}>
                <ToolBar />
                { view }
            </div>
            <div style={{textAlign:"center",backgroundColor:"black"}}>
                © { state.cooper.get() } { new Date().getFullYear() }
            </div>
        </React.Fragment>
    );
}

/**
 * window.onbeforeunload =(event)=> { 
            event.preventDefault(); 
            fetchApi("exit", {}, (res)=> {
                if(res.error) useInfoToolbar("error", "Error", res.error);
                else console.log(res);
            });
        };
 */