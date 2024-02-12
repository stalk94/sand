import React from 'react';
import { Responce } from "../lib/type";
import { InputText } from 'primereact/inputtext';
import "../style/auth.css";
import { Button } from 'primereact/button';
import globalState from "../global.state";
import { useInfoToolbar } from "../engineHooks";




export default function Auth({onView}) {
    const [login, setLogin] = React.useState<string>();
    const [pass, setPass] = React.useState<string>();


    const serverFetch =()=> {
        send('auth', {login:login,pass:pass}).then((val:Responce)=> {
            if(val.error) useInfoToolbar("error", "Ошибка", val.error);
            else {
                globalState.set(val);
                onView();
            }
        });
    }

    return(
        <div className='form'>
            <div className='formInput'>
                <InputText 
                    placeholder='Логин'
                    value={login}
                    onChange={(ev)=> setLogin(ev.target.value)}
                />
                <InputText 
                    placeholder='Пaроль'
                    value={pass}
                    onChange={(ev)=> setPass(ev.target.value)}
                />
            </div>
            <Button 
                label="Авьоризация" 
                icon="pi pi-sign-out" 
                iconPos="left" 
                onClick={serverFetch}
            />
        </div>
    );
}