import "../style/user.css";
import React from 'react';
import { Responce, Massage, Log } from "../lib/type";
import { useHookstate } from '@hookstate/core';
import globalState from "../global.state";
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { ScrollPanel } from 'primereact/scrollpanel';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaInfo } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { MdPostAdd } from "react-icons/md";
import { useToolbar, fetchApi, useInfoToolbar, encodeImageFileAsURL } from "../engineHooks";
import { AddUser, SendMail } from "./modal.user";
import { useDidMount } from "rooks";
const permision = ["👑 Главный админ", "💼 Админ", "🛒 Продавец"];


const Logs =()=> {
    const [logs, setLogs] = React.useState<Array<Log>>([]);

    const getColor =(data: Log)=> {
        if(data.type==='system crash') return 'red';
        else if(data.type==='critical') return '#f9d55d';
        else return 'grey';
    }
    useDidMount(()=> {
        fetchApi("getLogs", {type:'error'}, (res)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else setLogs(res);
        });
    });
    

    return(
            <DataTable paginator
                rows={15}
                style={{width:"80%"}}
                value={logs.reverse()}
                selectionMode={'single'} 
            >
                <Column
                    header={<><IoMdTime/> время</>}
                    body={(data)=> <>[{data.timeshtamp.data}]  {data.timeshtamp.time}</>}
                />
                <Column header={<><MdPostAdd/> сообщение</>}
                    body={(data)=>
                        <ScrollPanel style={{maxHeight:'60px'}}>
                            <var style={{color:getColor(data)}}>
                                {data.msg}
                            </var>
                        </ScrollPanel>
                    } 
                />
                <Column header={<><FaInfo/> статус</>}
                    body={(data)=> {
                        if(data.type==='system crash') return '❗️🆘';
                        else if(data.type==='critical') return '⚠️';
                        else return '❕';
                    }}
                />
            </DataTable>
    );
}
const LabelMassage =()=> {
    const massage = useHookstate(globalState.user.massage);

    return(
        <div>
            Почта 
            {(()=> {
                const cache = massage.get().filter((msg)=> !msg.view && msg);
        
                if(cache.length > 0) return(
                    <var style={{color:"green",marginLeft:"4px"}}>
                        +{cache.length}
                    </var>
                );
            })()}
        </div>
    )
}
const BasePanel =()=> {
    const state = useHookstate(globalState.user);
    const [update, setUpdate] = React.useState(state.intervalLoad.get());
    
    
    const readPassword:React.MouseEventHandler =(ev)=> {
        const cache = {old: "", password: ""};
        confirmPopup({
            rejectLabel: 'отмена',
            acceptLabel: 'изменить',
            target: ev.currentTarget,
            message:
                <>
                    <Password feedback={false} placeholder="старый пароль" onChange={(event:React.ChangeEvent)=> cache.old = event.value} />
                    <Password feedback={false} placeholder="новый пароль" onChange={(event:React.ChangeEvent)=> cache.password = event.value} />
                </>,
            accept: ()=> fetchApi("readPassword", cache, (val:Responce|string)=> {
                if(val.error) useInfoToolbar("error", 'Ошибка', val.error);
                else useInfoToolbar("sucess", 'Пароль изменен', val);
            })
        });
    }
    const useReadSettings =()=> {
        const data = {
            intervalLoad: update,
        }

        fetchApi("readSettings", data, (res:Responce|string)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else {
                useInfoToolbar("sucess", 'Успешно', 'изменения приняты');
                state.set(res);
            }
        });
    }


    return(
        <>
            <ConfirmPopup />
            <Fieldset legend={<div><FaInfo /> Данные</div>}>
                <div>
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
            <Fieldset legend={<div><IoSettingsOutline /> Настройки</div>}>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div>автообновление(сек.): </div>
                    <input  style={{width:"50px",marginLeft:"2%"}}
                        onChange={(ev=> setUpdate(ev.target.value*1000))}
                        type='number'
                        max={20}
                        min={3}
                        value={update/1000}
                    />
                </div>
                <Button className="p-button-outlined"
                    style={{marginTop:"3%"}}
                    icon="pi pi-save"
                    label="применить"
                    onClick={useReadSettings}
                />
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
    // доработать
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



export default function UserContainer() {
    const [view, setView] = React.useState<JSX.Element>();
    const [modal, setModal] = React.useState<string|undefined>();
    const [curent, setCurent] = React.useState<'base'|'post'|'users'|'logs'>('users');
    const users = useHookstate(globalState.users);
    const state = useHookstate(globalState.user);

    const setMassageStatus =(massage: Massage)=> {
        fetchApi("readStatusMail", {msg:massage}, (res)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else state.massage.set(res);
        });
    }
    const loadAvatar =(data: string)=> {
        const req = {data:data, format:'png'};
        if(data.includes('image/jpeg')) req.format = 'jpg';
        else if(data.includes('image/png')) req.format = 'png';
        
        
        fetchApi("loadAvatar", req, (res)=> {
            console.log(res)
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else state.avatar.set(res.url);
        });
    }
    const header =()=> {
        if(state.permision.get()===0) return(
            <Button onClick={()=> setModal("addUser")} className="p-button-success" icon="pi pi-plus"/>
        );
    }
    
    React.useEffect(()=> {
        const items = [{   
                label: 'Анкета', 
                icon: 'pi pi-user', 
                command:()=> setCurent('base')
            },{   
                label: <LabelMassage />, 
                icon: 'pi pi-envelope', 
                command:()=> setCurent('post')
            },{   
                label: 'Сотрудники', 
                icon: 'pi pi pi-users', 
                command:()=> setCurent('users')
            }
        ];
        if(globalState.user.permision.get()===0) items.push({   
            label: 'Логи сервера', 
            icon: 'pi pi pi-server', 
            command:()=> setCurent('logs')
        });
        useToolbar(<Menu style={{width:"20%"}} model={items}/>);

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
            <DataTable paginator
                header={header} 
                footer={<div>Пользователей всего: {users.get().length}</div>}
                style={{width:"100%"}} 
                value={users.get()} 
                rows={10} 
            >
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
        else if(curent==="logs") setView(<Logs />);
    }, [curent, modal, state]);
    

    return(<>{ view }</>);
}


/**
 * <img src={users.get()[data.author].avatar ?? "https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png"}
                            height="30px"
                        />
 */