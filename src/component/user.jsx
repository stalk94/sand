import React from 'react';
import { useHookstate } from '@hookstate/core';
import globalState from "../global.state";
import { Card } from 'primereact/card';
import { useDidMount } from 'rooks';
import { useToolbar, fetchApi } from "../engineHooks";


const RightPanel =()=> {
    const state = useHookstate(globalState.user);

    return(
        <div>
            { state.login.get() }
        </div>
    );
}


export default function User() {
    const state = useHookstate(globalState.user);

    useDidMount(()=> {
        useToolbar();
    });

    return(
        <Card style={{width:"100%"}}
            header={
                <div style={{display:"flex"}}>
                    <img 
                        style={{width:"25%"}} 
                        alt="Card" 
                        src={state.avatar.get() ?? "https://png.pngtree.com/png-vector/20220527/ourlarge/pngtree-unknown-person-icon-avatar-question-png-image_4760937.png"}
                    />
                    <RightPanel/>
                </div>
            }
       >
            Content
        </Card>
    );
}