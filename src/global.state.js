import { hookstate } from '@hookstate/core';


const globalState = hookstate({
    cooper: 'Копирайт',
    logo: undefined,
    user: {
        login: "test",
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
                    content: {
                        title: '',
                        text: '',
                    }
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
    lids: {
        groups: [
            "tractors",
            "motors",
            "flowers",
            "food"
        ],
        customers: [
            {
                id: 0,
                timeshtamp: '24.02.2023',
                author: "test",
                status: "close",
                price: 300,
                name: "Jane Cooper",
                company: "Microsoft",
                phone: "(255) 555-0118",
                email: "jane@mickrosoft.com",
                country: {
                    name: "USA",
                    region: ""
                },
                description: "lorem ipsum sorem inu merol",
            },
            {
                id: 0,
                timeshtamp: '24.02.2023',
                author: "test",
                status: "close",
                price: 300,
                name: "Jane Cooper",
                company: "Microsoft",
                phone: "(255) 555-0118",
                email: "jane@mickrosoft.com",
                country: {
                    name: "USA",
                    region: ""
                },
                description: "lorem ipsum sorem inu merol",
            },
            {
                id: 0,
                timeshtamp: '24.02.2023',
                author: "test",
                status: "close",
                price: 300,
                name: "Jane Cooper",
                company: "Microsoft",
                phone: "(255) 555-0118",
                email: "jane@mickrosoft.com",
                country: {
                    name: "USA",
                    region: ""
                },
                description: "lorem ipsum sorem inu merol",
            },
            
        ]
    },
    calendar: {},
    stat: {
        
    },
    users: []
});


export default globalState;