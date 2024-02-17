import "../style/user.css";
import React from 'react';
import { Responce, Massage } from "../lib/type";
import { useHookstate } from '@hookstate/core';
import globalState from "../global.state";
import { Card } from 'primereact/card';
import { useDidMount } from 'rooks';
import { Menu } from 'primereact/menu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { ScrollPanel } from 'primereact/scrollpanel';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import { useToolbar, fetchApi, useInfoToolbar } from "../engineHooks";
import { AddUser, SendMail } from "./modal.user";
const permision = ["👑 Главный админ", "💼 Админ", "🛒 Продавец"];
 

const LabelMassage =()=> {
    let count = 0;
    const [view, setView] = React.useState<JSX.Element>();
    React.useEffect(()=> {
        const massage = globalState.user.massage.get();
        massage.forEach((msg)=> !msg.view && count++);
        if(count > 0) setView(
            <var style={{color:"green",marginLeft:"4px"}}>
                +{count}
            </var>
        );
    }, []);


    return(
        <div>
            Почта 
            {view}
        </div>
    )
}
const BasePanel =()=> {
    const state = useHookstate(globalState.user);
    
    const readPassword:React.MouseEventHandler =(ev)=> {
        const cache = {old: "", password: ""};
        confirmPopup({
            rejectLabel: 'отмена',
            acceptLabel: 'изменить',
            target: ev.currentTarget,
            message:
                <>
                    <Password placeholder="старый пароль" onChange={(event:React.ChangeEvent)=> cache.old = event.value} />
                    <Password placeholder="новый пароль" onChange={(event:React.ChangeEvent)=> cache.password = event.value} />
                </>,
            accept: ()=> fetchApi("readPassword", cache, (val:Responce|string)=> {
                if(val.error) useInfoToolbar("error", 'Ошибка', val.error);
                else useInfoToolbar("sucess", 'Пароль изменен', val);
            })
        });
    }


    return(
        <>
            <ConfirmPopup />
            <Fieldset legend="Данные">
                <div >
                    id: { state.id.get() }
                </div>
                <div>
                    login: { state.login.get() }
                </div>
                <div>
                    permision: { permision[state.permision.get()] }
                </div>
                <Button className="p-button-outlined p-button-warning"
                    style={{height:"25px",marginTop:"15px"}}
                    label="смена пароля"
                    onClick={readPassword}
                />
            </Fieldset>
            <Fieldset legend="Статистика">

            </Fieldset>
        </>
    );
}
const UserSettings =({userData})=> {
    const [modal, setModal] = React.useState<"edit"|"post"|"ban"|undefined>();
    const state = useHookstate(globalState.user);

    const glavAdmin =()=> {
        return(
            <>
                <Button className="p-button-outlined p-button-warning"
                    icon="pi pi-user-edit"
                    onClick={()=> setModal("edit")}
                />
                <Button className="p-button-outlined p-button-warning"
                    style={{marginLeft:"2%"}}
                    icon="pi pi-envelope"
                    onClick={()=> setModal("post")}
                />
                <Button className="p-button-outlined p-button-danger"
                    style={{marginLeft:"2%"}}
                    icon="pi pi-times"
                    onClick={()=> setModal("ban")}
                />
            </>
        );
    }
    const admin =()=> {
        return(
            <>
                <Button className="p-button-outlined p-button-warning"
                    icon="pi pi-user-edit"
                    onClick={()=> setModal("edit")}
                />
                <Button className="p-button-outlined p-button-warning"
                    style={{marginLeft:"2%"}}
                    icon="pi pi-envelope"
                    onClick={()=> setModal("post")}
                />
            </>
        );
    }
    const useView =()=> {
        if(state.permision.get()===0) return glavAdmin();
        else if(state.permision.get()===1) return admin();
        else return <Button className="p-button-outlined p-button-warning"
            style={{marginLeft:"2%"}}
            icon="pi pi-envelope"
            onClick={()=> setModal("post")}
        />
    }

    return(
        <div style={{display:"flex",flexDirection:"row"}}>
            <SendMail onView={modal==="post"?true:false} useView={setModal} user={userData}/>
            {state.login.get()!==userData.login ? useView() : ""}
        </div>
    );
}



export default function User() {
    const [view, setView] = React.useState<JSX.Element>();
    const [modal, setModal] = React.useState<string|undefined>();
    const [curent, setCurent] = React.useState<'base'|'post'|'users'>('base');
    const users = useHookstate(globalState.users);
    const state = useHookstate(globalState.user);

    const setMassageStatus =(massage:Massage)=> {
        fetchApi("readStatusMail", {msg:massage}, (res)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else state.massage.set(res);
        });
    }
    const header =()=> {
        if(state.permision.get()===0) return(
            <Button onClick={()=> setModal("addUser")} className="p-button-success" icon="pi pi-plus"/>
        );
    }
    useDidMount(()=> {
        const items = [{   
                label: 'Анкета', 
                icon: 'pi pi-user', 
                command:()=> setCurent('base')
            },{   
                label: <LabelMassage/>, 
                icon: 'pi pi-envelope', 
                command:()=> setCurent('post')
            },{   
                label: 'Сотрудники', 
                icon: 'pi pi pi-users', 
                command:()=> setCurent('users')
            }
        ];

        useToolbar(<Menu style={{width:"20%"}} model={items}/>);
    });
    React.useEffect(()=> {
        if(curent==="base") setView(
            <Card style={{width:"100%"}}
                header={
                    <img className='avatar' style={{width:"18%"}}
                        src={state.avatar.get() ?? "https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png"}
                    />
                }
            >
                <BasePanel />
            </Card>
        );
        else if(curent==="users") setView(
            <>
            <AddUser onView={modal==="addUser"?true:false} useView={setModal}/>
            <DataTable header={header} style={{width:"100%"}} value={users.get()} rows={10} paginator>
                <Column 
                    field="avatar" 
                    header="avatar"
                    body={(data)=> 
                        <img src={data.avatar ?? "https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png"}
                            height="30px"
                        />
                    }
                />
                <Column field="login" header="name"/>
                <Column header="permision" body={(data)=> permision[data.permision]}/>
                <Column body={(data)=> <div style={{color:data.online?"green":"red"}}>{data.online?"online":"offline"}</div>} header="online"/>
                <Column body={(data)=> <UserSettings userData={data}/>} />
            </DataTable>
            </>
        );
        else if(curent==="post") setView(
            <DataTable paginator
                rows={15}
                style={{width:"80%"}}
                value={state.massage.get()} 
                onSelectionChange={(ev)=> setMassageStatus(ev.value)}
                selectionMode={'single'} 
            >
                <Column field="timeshtamp" header='время'/>
                <Column field="author" header='от'/>
                <Column header='сообщение'
                    body={(data)=>
                        <ScrollPanel style={{maxHeight:'60px'}}>
                            <p style={{color:"#f8c987"}}>
                                {data.text}
                            </p>
                        </ScrollPanel>
                    } 
                />
                <Column body={(data)=> data.view
                        ? <FaRegEnvelopeOpen color="grey" size='1.5em'/>
                        : <FaRegEnvelope color="orange" size='1.5em'/>
                    }
                />
            </DataTable>
        );
    }, [curent, modal]);


    return(<>{ view }</>);
}


/**
 * <img src={users.get()[data.author].avatar ?? "https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png"}
                            height="30px"
                        />
 */