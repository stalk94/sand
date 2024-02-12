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
    lids: [],
    calendar: {},
    stat: {
        
    },
    users: []
});


export default globalState