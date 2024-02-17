type ColumnTodo = {
    id: number
    index: number
    cards: Array<{
        index: number
        content: object
    }>
}
export type Massage = {
    id: number
    text: string
    author: string
    timeshtamp: string
    view: boolean
}
export interface User {
    login: string
    token: string
    id: number
    avatar: string|undefined
    color: string
    permision: 0|1|2
    massage: Array<Massage>
    todo: {
        column: Array<ColumnTodo>
    }
}
export interface Contact {
    id: number
    name: string
    timeshtamp: string
    telephone: string|number
    category: string
    author: string
}


export type Responce = {
    error: string
    cooper: string
    logo: string
    user: User
    contacts: Array<Contact>
    lids: Array<any>
    stat: object
    users: Array<User>
}

export type EventCalendar = {
    id: number
    day: number
    title: string
    author: string
    to: string
    content: {
        color: "#f4151585"|"#73df26cf"|"#e7ce0dcf"|"#2660e8cf"
        text: string
    }
}

export type Day = {
    day: number
    weeknumber: number
    dayname: string
}

export interface Lid {
    id: number
    timeshtamp: string
    author: string
    status: string
    price: number
}

export type DataRenderContact = {
    name: string
    count: number
}

export type DataRenderLid = {
    name: string
    count: number
    close: number
    filed: number
    price: number
}