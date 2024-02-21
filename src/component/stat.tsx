import React from 'react';
import "../style/stat.css";
import { Stat } from "../lib/type";
import { Chart } from 'primereact/chart';
import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';
import { useInfoToolbar, fetchApi, useToolbar } from "../engineHooks";
import { useDidMount, useWillUnmount } from 'rooks';



export default function Statistic() {

    useDidMount(()=> {
        useToolbar();
    });

    return(
        <>
        </>
    );
}