import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import globalState from "../global.state";
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { AutoComplete } from 'primereact/autocomplete';
import { useInfoToolbar, fetchApi, loadToCsv } from "../engineHooks";
import { Dropdown } from 'primereact/dropdown';
import { FaExclamation, FaCrown, FaUser, FaStar } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { IoReload } from "react-icons/io5";


const priorety = {
    exc: <FaExclamation color="red"/>,
    crown: <FaCrown color="gold" />,
    user: <FaUser />,
    groop: <MdGroup color="green" />,
    star: <FaStar color="#e5ee72" />
}
const dropDown = [
    {label: <FaUser />, value: "user"},
    {label: <MdGroup color="green" />, value: "groop"},
    {label: <FaStar color="#e5ee72" />, value: "star"},
    {label: <FaCrown color="gold" />, value: "crown"},
    {label: <FaExclamation color="red"/>, value: "exc"}
]


const AddContact =({useCache})=> {
    const [state, setState] = React.useState({});

    const setVal =(ev)=> {
        setState((old)=> {
            old[ev.target.name] = ev.target.value
            return old
        });
        useCache(state);
    }


    return(
        <div style={{display:"flex", flexDirection:"column"}}>
            <Dropdown name="priorety" options={dropDown} onChange={setVal} placeholder='priority'/>
            <AutoComplete name="name" onChange={setVal} placeholder='name'/>
            <AutoComplete name="telephone" onChange={setVal} placeholder='telephone'/>
            <AutoComplete name="category" onChange={setVal} placeholder='category'/>
        </div>
    )
}



export default function ContactData() {
    const [total, setTotal] = React.useState(globalState.contacts.length);
    const [filter, setFilter] = React.useState(true);
    const [state, setState] = React.useState(globalState.contacts.get());

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
        else if(action==='readPriorety') {
            let cache = detail.priorety;
            confirmPopup({
                rejectLabel: 'отмена',
                acceptLabel: 'изменить',
                target: ev.currentTarget,
                message: <Dropdown value={detail.priorety} options={dropDown} onChange={(event)=> cache = event.value}/>,
                accept: ()=> setServerData('readContact', {name:cache, id:detail.id})
            });
        }
        else setServerData('delContact',{id:detail});
    }
    const useAddcontact =(ev)=> {
        let cache = {};
        confirmPopup({
            rejectLabel: 'отмена',
            acceptLabel: 'добвить',
            target: ev.currentTarget,
            message: <AddContact useCache={(data)=> cache = data}/>,
            accept: ()=> setServerData('addContact', cache)
        });
    }
    const filtre =(type, detail)=> {
        if(type==="category"){
            setState((state)=> {
                let newState = state.filter((elem)=> elem.category===detail);
                setTotal(newState.length);
                return newState;
            });
        }
        else if(type==="author"){
            setState((state)=> {
                let newState = state.filter((elem)=> elem.author===detail);
                setTotal(newState.length);
                return newState;
            });
        }
        setFilter(false);
    }
    

    const heaader =(
        <div style={{display:"block"}}>
            <Button style={{marginRight:"5px"}} onClick={()=> loadToCsv(state)} icon="pi pi-upload"/>
            <Button style={{marginRight:"5px"}} icon="pi pi-print"/>
            <Button onClick={useAddcontact} className="p-button-success" icon="pi pi-plus"/>
            <Button 
                style={{marginRight:"5px",float:"right"}}
                disabled={filter} 
                className="p-button-outlined p-button-secondary" 
                icon={<IoReload />}
                onClick={()=> {
                    setState(globalState.contacts.get()); 
                    setTotal(globalState.contacts.length); 
                    setFilter(true);
                }}
            />
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
                    rows={15}
                    value={state} 
                    header={heaader}
                    footer={footer}
                    responsiveLayout="scroll"
                >
                    <Column header="name" body={(rowData)=> 
                        <div>
                           { rowData.name }
                            <Button 
                                style={{float:"right",border:"none"}}
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
                                <var onClick={()=> filtre("category", rowData.category)} style={{fontSize:"20px",cursor:"pointer"}}>{ rowData.category }</var>
                                <Button 
                                    style={{float:"right",border:"none"}}
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
                                style={{float:"right",border:"none"}}
                                className="p-button-outlined p-button-secondary"
                                icon="pi pi-pencil" 
                                onClick={(ev)=> useAction("readTel", rowData, ev)}
                            />
                        </div>
                    }/>
                    <Column header="time" body={(rowData)=> <div>{ rowData.timeshtamp }</div>}/>
                    <Column header="author" body={(rowData)=> 
                        <var 
                            onClick={()=> filtre("author", rowData.author)} 
                            style={{fontSize:"20px",cursor:"pointer",color:globalState.user.login.get()===rowData.author?"#f9cb76":""}}
                        >
                            { rowData.author }
                        </var>
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