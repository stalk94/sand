import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import "primereact/resources/themes/luna-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./engine";
import globalState from "./global.state";
import { useHookstate } from '@hookstate/core';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import ContactData from "./component/contacts";
import User from "./component/user";
import ToolBar from "./component/toolbar";
import { Toast } from 'primereact/toast';
import { useDidMount } from 'rooks';
import { useInfoToolbar } from "./engineHooks";


const navigation = [
    {label:'Контакты',icon:'pi pi-phone'},
    {label:'Лиды',icon:'pi pi-users'},
    {label:'Календарь',icon:'pi pi-fw pi-calendar'},
    {label:'Статистика',icon:'pi pi-chart-bar'},
    {label:'Планировщик',icon:'pi pi-book'}
];
const icon = {
    sucess: "✔️",
    error: "🛑",
    warn: "💡"
}


const App =()=> {
    const state = useHookstate(globalState);
    const [view, setView] = React.useState();
    const toast = React.useRef(null);
    
    const showToast =(type, title, text)=> {
        toast.current.show({
            severity: type, 
            summary: <>{ icon[type] }{ title }</>, 
            detail: text, 
            life: 2000
        });
    }
    useDidMount(()=> {
        setView(<User/>);
        document.querySelector(".p-menubar-root-list").addEventListener("click", (ev)=> {
            let target = ev.target.textContent;
            if(target==='Контакты') setView(<ContactData useViev={setView}/>);
            else if(target==='Планировщик') setView();
            else setView();
        });
        EVENT.on("infoPanel", (detail)=> showToast(detail.type, detail.title, detail.text));
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
            <Toast position="bottom-left" ref={toast} />
            <div style={{textAlign:"center",backgroundColor:"black"}}>
                © { globalState.cooper.get() } { new Date().getFullYear() }
            </div>
        </>
    );
}




window.onload =()=> createRoot(document.querySelector(".root")).render(
    <App/>
);