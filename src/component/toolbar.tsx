import React from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { useDidMount, useWillUnmount } from 'rooks';




export default function ToolBar() {
    const [state, setState] = React.useState<any>();

    const hookView =(detail: any)=> {
        if(detail) setState(detail);
        else setState("");
    }
    useDidMount(()=> EVENT.on("toolbar", hookView));
    useWillUnmount(()=> EVENT.off("toolbar", hookView));

    
    return(<>{ state }</>);
}