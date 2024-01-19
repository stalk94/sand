import React from 'react';
import { createRoot } from 'react-dom/client'
import "primereact/resources/themes/luna-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./engine";
import globalState from "./global.state";
import { useHookstate } from '@hookstate/core';
import { MegaMenu } from 'primereact/megamenu';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import ContactData from "./component/contacts";
import UserData from "./component/user/user-table"
import { useDidMount } from 'rooks';

const modelBar = [
    {label: 'Статистика', icon: 'pi pi-chart-line', id:0},
    {label: 'Пункт 2', icon: 'pi pi-calculator', id:1}
];
const navigation = [
    {label:'Контакты',icon:'pi pi-phone'},
    {label:'Лиды',icon:'pi pi-users'},
    {label:'Календарь',icon:'pi pi-fw pi-calendar'},
    {label:'Статистика',icon:'pi pi-chart-bar'},
    {label:'Планировщик',icon:'pi pi-book'}
]


const App =()=> {
    const state = useHookstate(globalState);
    const [view, setView] = React.useState();
    
    useDidMount(()=> {
        setView(<ContactData useViev={setView}/>);
        document.querySelector(".p-menubar-root-list").addEventListener("click", (ev)=> {
            let target = ev.target.textContent;
            if(target==='Контакты') setView(<ContactData useViev={setView}/>);
            else if(target==='Планировщик') setView();
            else setView(<UserData useViev={setView}/>);
        });

    });
    const serverCall =()=> {

    }

    
    return(
        <>
            <Menubar 
                model={navigation}
                start={<img width={50} src={state.logo.get() ?? "https://www.primefaces.org/primereact/images/logo.png"}/>}
                end={
                    <>
                        <Button icon="pi pi-user"/>
                    </>
                }
            />
            <div style={{display:"flex",flexDirection:"row"}}>
                <MegaMenu  
                    orientation="vertical"
                    model={modelBar}
                    onClick={(ev)=> console.log(ev.target.outerText)}
                />
                { view }
            </div>
            <div style={{textAlign:"center",backgroundColor:"black"}}>
                © { globalState.cooper.get() } { new Date().getFullYear() }
            </div>
        </>
    );
}




window.onload =()=> createRoot(document.querySelector(".root")).render(
    <App/>
);