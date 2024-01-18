import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import globalState from "../../global.state";
import { useHookstate } from '@hookstate/core';
import { Card } from 'primereact/card';


const Cards =()=> {
    return(
        <div style={{display:"flex"}}>
            <Card 
                header={<div style={{'fontSize':'25px'}}>Users:</div>} 
                style={{margin:"10px",backgroundColor:"#d95e5ec2",borderWidth:"1px",borderStyle:"solid",borderColor:"#ffffff85"}}
            >    
                <i className="pi pi-users" style={{'fontSize':'2em'}}>
                    {" "+globalState.clients.get().length} 
                </i>
            </Card>
            <Card style={{margin:"10px"}}>
               
            </Card>
            <Card style={{margin:"10px"}}>
               
            </Card>
        </div>
    );
}



export default function UserData({useViev}) {
    const [countClient, setCount] = React.useState(0);
    const clients = useHookstate(globalState.clients);


    const calculate =(basket)=> {
        let result = 0;
        basket.map((cur)=> result += cur.total);
        return result;
    }
    const useAction =(action, id)=> {

    }
    const imageBodyTemplate =(row)=> {
        return (
            <img 
                src={row.info.src} 
                onError={(e)=> e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                style={{width:"70px",height:"80px"}}
            />
        );
    }
    const Buttons =(rowData)=> (
        <>
            <Button className="p-button-secondary" icon="pi pi-id-card" onClick={()=> useAction("detail", rowData.id)}/>
            <Button icon="pi pi-phone" onClick={()=> useAction("massage", rowData.id)}/>
            <Button className="p-button-danger" icon="pi pi-times-circle" onClick={()=> useAction("del", rowData.id)}/>
        </>
    );

    const heaader =(
        <div className="table-header">
            <Button style={{marginRight:"5px"}} icon="pi pi-upload"/>
            <Button style={{marginRight:"5px"}} icon="pi pi-print"/>
        </div>
    );
    const footer =(
        <var>
            Всего клиентов: {countClient}
        </var>
    );
    
    // удаление и назначить только главному видны
    return (
        <div style={{width:"100%"}} className="datatable-templating-demo">
            <Cards/>
            <div className="card">
                <DataTable 
                    value={clients.get()} 
                    header={heaader}
                    footer={footer}
                    responsiveLayout="scroll"
                >
                    <Column header="id" body={(rowData)=> <div>{rowData.id}</div>}/>
                    <Column header="ФИО" body={(raw)=> <div>{raw.info.name}</div>}/>
                    <Column 
                        header="Агент" 
                        body={(rowData)=> (
                            <div>
                                { rowData.agent }
                            </div>
                        )}
                    />
                    <Column 
                        header="Сайт" 
                        body={(rowData)=> (
                            <div style={{color:"grey"}}>
                                site.ru
                            </div>
                        )}
                    />
                    <Column 
                        header="Статус" 
                        body={(rowData)=> (
                            <div style={{color:"orange"}}>
                                В работе
                            </div>
                        )}
                    />
                    <Column 
                        header="Назначить" 
                        body={(rowData)=> (
                            <Button 
                                className="p-button-success" 
                                icon="pi pi-share-alt" 
                                onClick={()=> useAction("agent", rowData.id)}
                            />
                        )}
                    />
                    <Column header="Действия" body={Buttons}/>
                </DataTable>
            </div>
        </div>
    );
}