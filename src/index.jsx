import React from 'react';
import "primereact/resources/themes/luna-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./lib/engine";
import Base from "./app";
import Auth from "./component/auth";
import globalState from "./global.state";
import { useDidMount } from 'rooks';
import { Toast } from 'primereact/toast';
import { useHookstate } from '@hookstate/core';
import { createRoot } from 'react-dom/client';



const icon = {
    sucess: "✔️",
    error: "🛑",
    warn: "💡"
}


function App() {
    const [view, setView] = React.useState();
    const state = useHookstate(globalState);
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
        EVENT.on("infoPanel", (detail)=> showToast(detail.type, detail.title, detail.text));
        if(state.user.get() && state.user.login.get()) setView(<Base/>);
        else setView(<Auth onView={()=> setView(<Base/>)}/>);
    });
    

    return(
        <div>
            <Toast position="bottom-left" ref={toast} />
            { view }
            <footer style={{textAlign:"center",backgroundColor:"black",marginTop:'3px'}}>
                © { state.cooper.get() } { new Date().getFullYear() }
            </footer>
        </div>
    );
}


window.onload =()=> createRoot(document.querySelector(".root")).render(
    <App/>
);