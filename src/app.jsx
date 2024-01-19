import React from 'react';
import globalState from "./global.state";
import { useHookstate } from '@hookstate/core';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import ContactData from "./component/contacts";
import User from "./component/user";
import ToolBar from "./component/toolbar";
import { useDidMount } from 'rooks';



const navigation = [
    {label:'Контакты',icon:'pi pi-phone'},
    {label:'Лиды',icon:'pi pi-users'},
    {label:'Календарь',icon:'pi pi-fw pi-calendar'},
    {label:'Статистика',icon:'pi pi-chart-bar'},
    {label:'Планировщик',icon:'pi pi-book'}
];



export default function BaseContainer() {
    const state = useHookstate(globalState);
    const [view, setView] = React.useState();
    
    useDidMount(()=> {
        setView(<User/>);
        document.querySelector(".p-menubar-root-list").addEventListener("click", (ev)=> {
            let target = ev.target.textContent;
            if(target==='Контакты') setView(<ContactData useViev={setView}/>);
            else if(target==='Планировщик') setView();
            else setView();
        });
    });

    
    return(
        <>
            <Menubar 
                model={navigation}
                start={<img width={50} src={state.logo.get() ?? "https://www.primefaces.org/primereact/images/logo.png"}/>}
                end={ <Button onClick={()=> setView(<User/>)} icon="pi pi-user"/>}
            />
            <div style={{display:"flex",flexDirection:"row"}}>
                <ToolBar/>
                { view }
            </div>
            <div style={{textAlign:"center",backgroundColor:"black"}}>
                © { globalState.cooper.get() } { new Date().getFullYear() }
            </div>
        </>
    );
}