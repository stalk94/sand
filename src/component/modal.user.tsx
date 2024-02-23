import "../style/modal.css";
import React from 'react';
import globalState from "../global.state";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ColorPicker } from 'primereact/colorpicker';
import { useInfoToolbar, fetchApi } from "../engineHooks";
const permisions = ["💼 Админ", "🛒 Продавец"];


export function AddUser({onView, useView}) {
    const [login, setLogin] = React.useState<string>();
    const [color, setColor] = React.useState<string>(Math.floor(Math.random()*16777215).toString(16));
    const [permision, setPermision] = React.useState<string>("🛒 Продавец");
    const [password, setPassword] = React.useState<string>();
   

    const addUser =()=> {
        fetchApi("addUser", {userLogin:login,password:password,permision:permision==="💼 Админ"?1:2,color:color}, (res)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else {
                globalState.users.set(res);
                setLogin();
                setPermision("🛒 Продавец");
                setPassword();
                useView();
            }
        });
    }
    const useDataInput:React.ChangeEventHandler =(ev)=> {
        if(ev.target.name==="login") setLogin(ev.target.value);
        else if(ev.target.name==="password") setPassword(ev.target.value);
        if(ev.target.name==="permision") setPermision(ev.target.value);
    }
    

    return(
        <Dialog 
            header="Создать нового пользователя" 
            visible={onView} 
            style={{width: '50vw'}} 
            modal 
            onHide={()=> useView()}
            footer={
                <span>
                    <Button onClick={addUser} label="Create user" icon="pi pi-check" className="p-button-success" style={{marginRight:'20px'}}/>
                    <Button onClick={()=> useView()} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                </span>
            }
        >
            <div className="column">
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">user name</label>
                    <InputText name="login" value={login} onChange={useDataInput} placeholder='min 5'/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">привелегия</label>
                    <Dropdown id="perm" name="permision" value={permision} onChange={useDataInput} options={permisions}/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">password</label>
                    <InputText name="password" value={password} onChange={useDataInput} placeholder='min 6'/>
                </div>
                <div className="field">
                    <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">цвет(для статистики)</label>
                    <ColorPicker style={{marginLeft:"5px",color:"gray"}} value={color} onChange={(e)=> setColor(e.value)} />
                </div>
            </div>
        </Dialog>
    );
}

export function SendMail({onView, useView, user}) {
    const [msg, setMsg] = React.useState<string>();
   
    const sendMail =()=> {
        fetchApi("sendMail", {userLogin:user.login, msg:msg}, (res)=> {
            if(res.error) useInfoToolbar("error", 'Ошибка', res.error);
            else {
                useView();
                setMsg();
                useInfoToolbar("sucess", 'Успешно', "сообщение отправлено");
            }
        });
    }
    
   
    return(
        <Dialog 
            header="Отправить сообщение" 
            visible={onView} 
            style={{width: '50vw'}} 
            modal 
            onHide={()=> useView()}
            footer={
                <span>
                    <Button onClick={sendMail} label="Send" icon="pi pi-check" className="p-button-success" style={{marginRight:'20px'}}/>
                    <Button onClick={()=> useView()} label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
                </span>
            }
        >
            <div className="field">
                <label style={{marginLeft:"5px",color:"gray"}} htmlFor="perm">Сообщение</label>
                <InputText name="msg" value={msg} onChange={(ev)=> setMsg(ev.target.value)} placeholder='min 3, max 700'/>
            </div>
        </Dialog>
    );
}