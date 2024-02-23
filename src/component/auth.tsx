import "../style/auth.css";
import React from 'react';
import { Responce } from "../lib/type";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import globalState from "../global.state";
import { useInfoToolbar } from "../engineHooks";




export default function Auth({onView}) {
    const [login, setLogin] = React.useState<string>('');
    const [pass, setPass] = React.useState<string>('');


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
                <var>Логин</var>
                <InputText
                    name='login' 
                    placeholder='min 5 simbol'
                    value={login}
                    onChange={(ev)=> setLogin(ev.target.value)}
                />
                <var>Пароль</var>
                <input
                    className='p-inputtext p-component'
                    placeholder='min 6 simbol'
                    type='password'
                    value={pass}
                    onChange={(ev)=> setPass(ev.target.value)}
                />
            </div>
            <Button style={{marginTop:"7%"}}
                label="Авторизация" 
                icon="pi pi-sign-out" 
                iconPos="left" 
                onClick={serverFetch}
            />
        </div>
    );
}