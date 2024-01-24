import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { AutoComplete } from 'primereact/autocomplete';
import { useHookstate } from '@hookstate/core';
import globalState from "../global.state";
import { useInfoToolbar, fetchApi } from "../engineHooks";



export default function ContactData({useViev}) {
    const [total, setTotal] = React.useState(globalState.contacts.length);
    const state = useHookstate(globalState.contacts);

    // важный хук, Отсылает данные на сервер и обновляет global state
    const setServerData =(path, data)=> {
        fetchApi(path, data, (val)=> {
            if(val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else state.set(val);
        });
    }
    const useAction =(action, detail, ev)=> {
        if(action==='readTel') {
            let cache = detail.telephone;
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <AutoComplete value={detail.telephone} onChange={(event)=> cache = event.value}/>,
                accept: ()=> setServerData('readContact', {telephone:cache, id:detail.id})
            });
        }
        else if(action==='readName') {
            let cache = detail.name;
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <AutoComplete value={detail.name} onChange={(event)=> cache = event.value}/>,
                accept: ()=> setServerData('readContact', {name:cache, id:detail.id})
            });
        }
        else if(action==='readCat') {
            let cache = detail.category;
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <AutoComplete value={detail.category} onChange={(event)=> cache = event.value}/>,
                accept: ()=> setServerData('readContact', {category:cache, id:detail.id})
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

    const header =(
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
                    value={state.get()} 
                    header={header}
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
                    <Column 
                        header="category"
                         body={(rowData)=> 
                            <div>
                            { rowData.category }
                                <Button 
                                        style={{float:"right"}}
                                        className="p-button-outlined p-button-secondary"
                                        icon="pi pi-pencil" 
                                        onClick={(ev)=> useAction("readCat", rowData, ev)}
                                    />
                            </div>
                        }   
                    />
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
                    <Column header="author" body={(rowData)=> <div>{ rowData.author }</div>}/>
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


/**
 * <div 
                                style={{cursor:"pointer"}}
                                onClick={(ev)=> {
                                    if(!ev.target.on || ev.target.on===0) {
                                        ev.target.on = 1;
                                        ev.target.style.color = "blue"
                                    }
                                    else {
                                        ev.target.on = 0;
                                        ev.target.style.color = "white"
                                    }
                            }}>
                                category 
                            </div>
 */