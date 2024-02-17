import React from 'react';
import "../style/stat.css";
import { Lid, DataRenderContact, DataRenderLid } from "../lib/type";
import globalState from "../global.state";
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { SelectButton } from 'primereact/selectbutton';
import { useToolbar, getFilterContact, getFilterLids, getUseTime } from "../engineHooks";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useDidMount, useWillUnmount } from 'rooks';
ChartJS.register(ArcElement, Tooltip, Legend);
const month = ["не выбрано","январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];



const HeadBlock =({date,useDate})=> {
    const getUserList =()=> {
        const users = ["все"];
        globalState.users.get().forEach((user)=> users.push(user.login));
        return users;
    }
    const getYear =()=> {
        const curent = new Date().getFullYear();

        const arr = [curent];
        for(let i=0; i<6; i++) {
            if(i!==0) arr.push(curent + i);
        }
        for(let i=0; i<4; i++) {
            if(i!==0) arr.unshift(curent - i);
        }
        arr.unshift("не выбрано");
        return arr;
    }


    return(
        <div className='filtreBox'>
            <Dropdown name="year"
                style={{marginLeft:"15px"}} 
                value={date[1]} 
                options={getYear()} 
                onChange={(ev)=> useDate([date[0], ev.value])} 
            />
            <Dropdown name="month"
                style={{marginLeft:"15px"}} 
                value={date[0]} 
                options={month} 
                onChange={(ev)=> useDate([ev.value, date[1]])} 
            />
        </div>
    );
}
const Checker =({data, value, useSetCurUser})=> {
    const [checked, setChek] = React.useState<boolean>(value);

    return(
        <ToggleButton 
            onLabel="-" 
            offLabel="+"
            checked={checked}
            onChange={(e)=> {
                if(checked) setChek(false);
                else setChek(true);
                useSetCurUser(e, data);
            }} 
        />
    )
}
const ListStatContact =({data, useCurUser, curentUser})=> {
    const [render, setRender] = React.useState<Array<DataRenderContact>>([]);

    const useSetCurUser =(elem:ToggleButtonChangeEvent, data:DataRenderContact)=> {
        if(elem.value===false){
            curentUser.forEach((name:string, index:number)=> {
                if(name===data.name) curentUser.splice(index, 1);
            });
            useCurUser(curentUser);
        }
        else useCurUser([...curentUser, data.name]);
    }
    const useValue =(rowData:DataRenderContact)=> {
        if(curentUser.find((elem: string)=> elem===rowData.name)) return true;
        else return false;
    }
    React.useEffect(()=> {
        const users = {};
        const result = [];

        data.forEach((cont)=> {
            if(users[cont.author]) users[cont.author]++;
            else users[cont.author] = 1;
        });
        Object.keys(users).forEach((name)=> {
            result.push({name:name, count:users[name]});
        });
        
        setRender(result);
    }, [data, curentUser]);
    
    
    return(
        <DataTable style={{width:"50%",marginLeft:"2%"}} value={render} rows={10} paginator>
            <Column field="name" header="name"></Column>
            <Column field="count" header="созданно" sortable></Column>
            <Column body={(rowData)=> 
                <Checker data={rowData} value={useValue(rowData)} useSetCurUser={useSetCurUser}/>
            }
            />
        </DataTable>
    );
}
const ListStatLids =({data, useCurUser, curentUser})=> {
    const [render, setRender] = React.useState<Array<DataRenderLid>>([]);

    const useSetCurUser =(elem:ToggleButtonChangeEvent, data:DataRenderLid)=> {
        if(elem.value===false){
            curentUser.forEach((name, index)=> {
                if(name===data.name) curentUser.splice(index, 1);
            });
            useCurUser(curentUser);
        }
        else useCurUser([...curentUser, data.name]);
    }
    const useValue =(rowData:DataRenderLid)=> {
        if(curentUser.find((elem: string)=> elem===rowData.name)) return true;
        else return false;
    }
    React.useEffect(()=> {
        const users = {};
        const result = [];

        data.forEach((lid)=> {
            if(!users[lid.author]){
                users[lid.author] = {count:0,close:0,filed:0,price:0};
            }

            users[lid.author].count++;
            if(lid.status==="close"){
                users[lid.author].close++;
                users[lid.author].price += lid.price;
            }
            else if(lid.status==="filed") users[lid.author].filed++;
        });
        Object.keys(users).forEach((name)=> {
            result.push({
                name: name, 
                count: users[name].count,
                close: users[name].close,
                filed: users[name].filed,
                price: users[name].price
            });
        });
        
        setRender(result);
    }, [data, curentUser]);
    
    
    return(
        <DataTable style={{marginLeft:"2%"}} value={render} rows={10} paginator>
            <Column field="name" header="author"/>
            <Column field="count" header="созд." sortable/>
            <Column field="close" header="закр." sortable/>
            <Column field="filed" header="провал." sortable/>
            <Column field="price" header="доход" sortable/>
            <Column body={(rowData)=> 
                <Checker data={rowData} value={useValue(rowData)} useSetCurUser={useSetCurUser}/>
            }
            />
        </DataTable>
    );
}

const StatContact =({date, curentUser, useCurUser})=> {
    const [curView, setView] = React.useState();
    
    const useFilter =()=> {
        if(curentUser.length > 0) {
            let result = [];
            curentUser.forEach((name)=> {
                result = [...result, ...getFilterContact(getUseTime(date), name)];
            }); 
            
            return result;
        }
        else return getFilterContact(getUseTime(date), undefined);
    }
    React.useEffect(()=> {
        const users = {};
        const dataRender = {labels:[],datasets:[{data:[],backgroundColor:[]}]};
        const data = useFilter();
       
        data.forEach((cont)=> {
            if(users[cont.author]) users[cont.author].push(cont);
            else users[cont.author] = [cont];
        });
        Object.keys(users).map((name)=>{
            const userFiltr = globalState.users.get().filter((user)=> user.login===name && user.color);
            dataRender.labels.push(name);
            dataRender.datasets[0].data.push(users[name].length);
            dataRender.datasets[0].backgroundColor.push(userFiltr[0].color);
        });
        
        setView(
            <div className='tableCont'>
               <div style={{width:"40%"}}>
                    <Pie data={dataRender}/>
                </div>
               <ListStatContact data={getFilterContact(getUseTime(date))} curentUser={curentUser} useCurUser={useCurUser}/>
            </div>
        );
    }, [date, curentUser]);
    

    return(
        <div style={{marginTop:"4%"}}>
            { curView }
        </div>
    );
}
const StatLids =({date, curentUser, useCurUser})=> {
    const category = [{icon:"pi pi-list",value:'all'},{icon:"pi pi-dollar",value:'price'},{icon:"pi pi-lock",value:'close'},{icon:"pi pi-times",value:'filed'}];
    const [curCategory, setCategory] = React.useState('all');
    const [curView, setView] = React.useState();

    const useFilter =()=> {
        if(curentUser.length > 0) {
            let result = [];
            curentUser.forEach((name)=> {
                result = [...result, ...getFilterLids(getUseTime(date), name)];
            }); 
            
            return result;
        }
        else return getFilterLids(getUseTime(date), undefined);
    }
    React.useEffect(()=> {
        const users = {};
        const dataRender = {labels:[],datasets:[{data:[],backgroundColor:[]}]};
        const data = useFilter();
       
        data.forEach((cont)=> {
            if(users[cont.author]) users[cont.author].push(cont);
            else users[cont.author] = [cont];
        });
        Object.keys(users).map((name, index)=> {
            const userFiltr = globalState.users.get().filter((user)=> user.login===name && user.color);
            dataRender.labels.push(name);
            if(curCategory==='all') dataRender.datasets[0].data.push(users[name].length);
            else if(curCategory==='price') {
                let price = 0;
                users[name].forEach((lid)=> {
                    if(lid.status==="close") price += lid.price;
                });
                dataRender.datasets[0].data.push(price);
            }
            else if(curCategory==='close') {
                let count = 0;
                users[name].forEach((lid)=> {
                    if(lid.status==="close") count ++;
                });
                dataRender.datasets[0].data.push(count);
            }
            else {
                let count = 0;
                users[name].forEach((lid)=> {
                    if(lid.status==="filed") count ++;
                });
                dataRender.datasets[0].data.push(count);
            }
            dataRender.datasets[0].backgroundColor.push(userFiltr[0].color);
        });
        
        setView(
            <div className='tableCont'>
               <div style={{width:"40%"}}>
                    <SelectButton  
                        options={category} 
                        onChange={(e)=> setCategory(e.value)}
                        style={{marginLeft:"15px",marginBottom:"1%"}}
                        itemTemplate={(option)=> <i className={option.icon}></i>} 
                        optionLabel="value"
                    />
                    <Pie data={dataRender}/>
                </div>
               <ListStatLids data={getFilterLids(getUseTime(date))} curentUser={curentUser} useCurUser={useCurUser}/>
            </div>
        );
    }, [date, curentUser, curCategory]);


    return(
        <div style={{marginTop:"4%"}}>
            { curView }
        </div>
    );
}
const StatAll =({date})=> {

    const useTime =()=> {
        let curmonth = '0';
        month.forEach((elem, index)=> {
            if(elem===date[0]){
                if(index < 10) curmonth = `0${index}`;
                else curmonth = index.toString();
            }
        });

        let time = "";
        if(date[0]!=="не выбрано") time = curmonth;
        if(date[1]!=="не выбрано") time = time + `.${date[1]}`;
        return time;
    }
    React.useEffect(()=> { 
        const contacts = getFilterContact(useTime());
        const lids = getFilterLids(useTime());


    }, [date]);


    return(
        <div className='allContainer'>
            
        </div>
    );
}


export default function Statistic() {
    const [date, setDate]= React.useState(['не выбрано', 'не выбрано']);
    const [cur, setCur] = React.useState<'all'|'lids'|'contact'>("all");
    const [curentUser, setCurUser] = React.useState<Array<string>>([]);
    const [curView, setView] = React.useState<JSX.Element>();        

   
    useDidMount(()=> {
        const items = [{   
                label: 'Общая информация', 
                icon: 'pi pi-chart-bar', 
                command:()=> setCur("all")
            },{   
                label: 'Контакты', 
                icon: 'pi pi-phone', 
                command:()=> setCur("contact")
            },{   
                label: 'Лиды', 
                icon: 'pi pi-users', 
                command:()=> setCur("lids")
            }
        ];

        useToolbar(<Menu style={{width:"20%"}} model={items}/>);
    });
    React.useEffect(()=> {
        if(cur==="contact") setView(<StatContact date={date} curentUser={curentUser} useCurUser={setCurUser}/>);
        else if(cur==="lids") setView(<StatLids date={date} curentUser={curentUser} useCurUser={setCurUser}/>);
        else if(cur==="all") setView(<StatAll date={date}/>);
    }, [date, curentUser, cur]);
   

    return(
        <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
            <HeadBlock date={date} useDate={setDate}/>
            { curView }
        </div>
    );
}