import { hookstate } from '@hookstate/core';


const globalState = hookstate({
    cooper: 'Копирайт',
    logo: undefined,
    user: {
<<<<<<< HEAD
        // login: "admin",
=======
        login: "test",
>>>>>>> 9b0b1fd980ea63e94f935dee46898753e2c27535
        token: "",
        id: 0,
        avatar: undefined,
        permision: 0,
        todo: {
            column: [{
                id: 0,
                index: 0,
                cards: [{
                    index: 0,
                    content: {}
                }]
            }]
        }
    },
    contacts: [
        {
            id: 0,
            name: "test",
            timeshtamp: '24.07.2023',
            telephone: "+384940932343",
            category: "важные",
            author: "admin",
            priorety: "star"
        },
        {
            id: 1,
            name: "test",
            timeshtamp: '24.07.2023',
            telephone: "+384940932343",
            category: "важн",
            author: "admin",
            priorety: "star"
        }
    ],
    lids: [
        {id:0,server:3,avatar:undefined,name:'Иван Иваныч',rating:[11,3],data:{},money:100000,permision:0},
        {id:1,server:2,avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7xaAu_GRlDE74dg6LaaBdL3hl1pQYPMWgg&usqp=CAU',name:'Ольга Цыган',rating:[10,5],data:{},money:100000,permision:1}, 
        {id:2,server:1,avatar:undefined,name:'Остап Ебло',rating:[100,10],data:{},money:100000,permision:2},
        {id:3,server:3,avatar:undefined,name:'Василий Еблан',rating:[100,10],data:{},money:100000,permision:2}
    ],
    calendar: {},
    stat: {}
});


export default globalState