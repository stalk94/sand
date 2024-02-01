import React from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { useDidMount, useWillUnmount } from 'rooks';


const modelBar = [
    {label: 'Статистика', icon: 'pi pi-chart-line', id:0},
    {label: 'Пункт 2', icon: 'pi pi-calculator', id:1}
];


export default function ToolBar() {
    const [state, setState] = React.useState();

    const hookView =(detail)=> {
        if(detail) setState(
            <MegaMenu  
                style={{width:"20%"}}
                orientation="vertical"
                start={detail}
            />
        );
        else setState("");
    }
    useDidMount(()=> EVENT.on("toolbar", hookView));
    useWillUnmount(()=> EVENT.off("toolbar", hookView));

    
    return(<>{ state }</>);
}