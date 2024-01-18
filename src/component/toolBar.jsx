import React from 'react';
import { Button } from "primereact/button";
import { Toolbar } from 'primereact/toolbar';



export function Tool() {
    const leftContents = (
        <React.Fragment>
            <Button label="Х" icon="pi pi-box" className="mr-2" />
            <Button label="Настройки" icon="pi pi-wrench" className="p-button-success" />
        </React.Fragment>
    );
    
    const rightContents = (
        <React.Fragment>
            <Button icon="pi pi-search" className="mr-2" />
            <Button icon="pi pi-calendar" className="p-button-success mr-2" />
            <Button icon="pi pi-times" className="p-button-danger" />
        </React.Fragment>
    );


    return(
        <Toolbar 
            left={leftContents} 
            right={rightContents}
        />
    );
}