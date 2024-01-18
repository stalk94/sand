import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';



export default function AgentData({useViev}) {
    const [total, setTotal] = React.useState(0);
    const agents = useHookstate(globalState.agents);


    const useAction =(action, id)=> {
        if(action==='search') {
            useViev("Страница деталей");
        }
    }
    const imageBodyTemplate =(data)=> {
        return (
            <img 
                src={data.avatar ?? `https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png`} 
                onError={(e)=> e.target.src='https://siliconvalleygazette.com/wp-content/uploads/2021/12/what-is-the-404-not-found-error.png'} 
                style={{width:"70px",height:"80px"}}
            />
        );
    }

    const heaader =(
        <div className="table-header">
            <Button style={{marginRight:"5px"}} icon="pi pi-upload"/>
            <Button style={{marginRight:"5px"}} icon="pi pi-print"/>
            <Button className="p-button-success" icon="pi pi-plus"/>
        </div>
    );
    const footer =(
        <var>
            Обший доход: {total}$
        </var>
    );
    
    
    return(
        <div style={{width:"100%"}} className="datatable-templating-demo">
            <div className="card">
                <DataTable 
                    value={agents.get()} 
                    header={heaader}
                    footer={footer}
                    responsiveLayout="scroll"
                >
                    <Column header="id" body={(rowData)=> <div>{rowData.id}</div>}/>
                    <Column header="Фото" body={imageBodyTemplate}/>
                    <Column header="ФИО" body={(raw)=> <div>{raw.name}</div>}/>
                    <Column  
                        header="^Клиентов" 
                        body={(rowData)=> (
                            <div>
                                { rowData.rating[0]}/{rowData.rating[1] }
                            </div>
                        )}
                    />
                    <Column field="rating" header="^Доходность" body={(rowData)=> <div>{rowData.money}</div>}/>
                    <Column
                        header="naxui" 
                        body={(rowData)=> (
                            <Button 
                                className="p-button-danger" 
                                icon="pi pi-times-circle" 
                                onClick={()=> useAction("del", rowData.id)}
                            />
                        )}
                    />
                    <Column 
                        header="detail" 
                        body={(rowData)=> (
                            <Button 
                                className="p-button-secondary"
                                icon="pi pi-search" 
                                onClick={()=> useAction("search", rowData.id)}
                            />
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
}