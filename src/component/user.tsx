import "../style/user.css";
import { Responce } from "../lib/type";
import React from 'react';
import { useHookstate } from '@hookstate/core';
import globalState from "../global.state";
import { Card } from 'primereact/card';
import { useDidMount } from 'rooks';
import { Menu } from 'primereact/menu';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { useToolbar, fetchApi, useInfoToolbar } from "../engineHooks";

 
const BasePanel =()=> {
    const permision = ["👑 Главный админ", "💼 Админ", "🛒 Продавец"];
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
            {state.permision.get() === 0 
                ? <Fieldset legend="Управление">
                
                </Fieldset>
                : ""
            }
        </>
    );
}



export default function User() {
    const state = useHookstate(globalState.user);
    useDidMount(()=> useToolbar(<Menu />));


    return(
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
}