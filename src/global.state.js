import { hookstate } from '@hookstate/core';


const globalState = hookstate({
    cooper: 'Копирайт',
    logo: undefined,
    user: {
        login: "test",
        token: "",
        id: 0,
        online: true,
        avatar: undefined,
        massage: [{
            text: "test",
            author: "test",
            timeshtamp: new Date().getDate()+"."+new Date().getMonth()+"."+new Date().getFullYear(),
            view: false
        }],
        permision: 0,
        color: "#"+Math.floor(Math.random()*16777215).toString(16),
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
        },
        {
            id: 2,
            name: "adm",
            timeshtamp: '24.08.2023',
            telephone: "+384940932343",
            category: "важн",
            author: "test",
            priorety: "star"
        }
    ],
    lids: [{
            id: 0,
            timeshtamp: '24.07.2023',
            author: "test",
            status: "close",
            price: 300
        },{
            id: 1,
            timeshtamp: '24.07.2023',
            author: "test",
            status: "filed",
            price: 300
        },{
            id: 2,
            timeshtamp: '24.07.2023',
            author: "admin",
            status: "close",
            price: 200
    }],
    calendar: {},
    users: [{
            login: "test",
            color: "#"+Math.floor(Math.random()*16777215).toString(16),
            permision: 0,
            online: false
        },{
            login: "admin",
            color: "#"+Math.floor(Math.random()*16777215).toString(16),
            permision: 1,
            avatar: undefined,
            online: true
        }
    ]
});


export const userFiltre = hookstate([]);
export default globalState