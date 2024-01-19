import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import globalState from "../global.state";
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { useHookstate } from '@hookstate/core';
import { AutoComplete } from 'primereact/autocomplete';



export default function ContactData({useViev}) {
    const [total, setTotal] = React.useState(0);
    const agents = useHookstate(globalState.contacts);

    const setServerData =(path, data)=> {
        send(path, data).then((val)=> agents.set(val));
    }
    const useAction =(action, detail, ev)=> {
        if(action==='readTel') {
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <AutoComplete value={detail.telephone} onChange={(event)=> console.log(event.value)}/>,
                accept: ()=> setServerData(detail),
                reject: ()=> console.log(detail)
            });
        }
        else if(action==='readName') {
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <AutoComplete value={detail.name} onChange={(event)=> console.log(event.value)}/>,
                accept: ()=> setServerData(detail),
                reject: ()=> console.log(detail)
            });
        }
        else setServerData('delContact',{id:detail});
    }
    const imageBodyTemplate =(data)=> {
        return (
            <img 
                src={data.avatar ?? `https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png`} 
                onError={(e)=> e.target.src='https://siliconvalleygazette.com/wp-content/uploads/2021/12/what-is-the-404-not-found-error.png'} 
                style={{width:"40px",height:"40px"}}
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
            Всего контактов: {total}
        </var>
    );
    
    
    return(
        <div style={{width:"100%"}} className="datatable-templating-demo">
            <div className="card">
                <ConfirmPopup />
                <DataTable 
                    value={agents.get()} 
                    header={heaader}
                    footer={footer}
                    responsiveLayout="scroll"
                >
                    <Column body={imageBodyTemplate}/>
                    <Column header="time" body={(rowData)=> <div>{ rowData.timeshtamp }</div>}/>
                    <Column header="name" body={(rowData)=> 
                        <div>
                           { rowData.name }
                            <Button 
                                    style={{float:"right"}}
                                    className="p-button-outlined p-button-secondary"
                                    icon="pi pi-pencil" 
                                    onClick={(ev)=> useAction("readName", rowData, ev)}
                                />
                        </div>
                    }/>
                    <Column field="rating" header="telophone" body={(rowData)=> 
                        <div>
                           { rowData.telephone }
                            <Button 
                                    style={{float:"right"}}
                                    className="p-button-outlined p-button-secondary"
                                    icon="pi pi-pencil" 
                                    onClick={(ev)=> useAction("readTel", rowData, ev)}
                                />
                        </div>
                    }/>
                    <Column 
                        body={(rowData)=> (
                            <div style={{marginLeft:"35%"}}>
                                <Button 
                                    className="p-button-danger" 
                                    icon="pi pi-times-circle" 
                                    onClick={()=> useAction("del", rowData.id)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
}