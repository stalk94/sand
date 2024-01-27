import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";

import "./../style/todo.css";

interface IList {
    listTitle: string;
    cards: ICard[];
}

interface ICard {
    title: string;
    content: string;
}

const data: IList[] = [
    {
        listTitle: "This is list",
        cards: [
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            }
        ]
    },
    {
        listTitle: "This is list",
        cards: [
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            }
        ]
    },
    {
        listTitle: "This is list",
        cards: [
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            },
            {
            title: "hello admin",
            content: "skldjfklsdjlf"
            }
        ]
    }
];

export default function ToDo() {
    const [lists, setLists] = useState<IList[]>(data);
    const [isCreateListForm, setIsCreateListForm] = useState<boolean>(false);
    const [isCreateCardForm, setIsCreateCardForm] = useState<boolean>(false);

    const drawBoard = (data) => {
        console.log(data);
        return (
            <>
                {data.map((list: IList) => {
                    return (
                        <Panel header={list.listTitle}>
                            {list.cards.map((card: ICard, id: number) => {
                                return <Card className="card" title={card.title} subTitle={card.content} key={id}/>
                            })}
                            {isCreateCardForm ? 
                                cardForm()
                                : 
                                <Button label="Create new list" onClick={((e) => setIsCreateCardForm(!isCreateCardForm))}/>
                            }
                        </Panel>
                    )
                })}
            </>    
        )
    }

    const listForm = () => {
        return (
            <form className="list-form">
                <InputText />
                <div className="form-buttons__container">
                    <Button label="confirn" onClick={((e) => e.preventDefault())}/>
                    <Button label="cancel" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
                </div>
            </form>
        )
    }

    const cardForm = () => {
        return (
            <form className="card-form">
                <InputText />
                <div className="form-buttons__container">
                    <Button label="confirm" onClick={((e) => e.preventDefault())}/>
                    <Button label="cancel" onClick={((e) => setIsCreateCardForm(!isCreateCardForm))}/>
                </div>
            </form>
        )
    }

    return (
        <div className="board">
            {drawBoard(lists)}
            {isCreateListForm ?
                listForm()   
                :
                <Button className="toggle-button" label="Create new list" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
            }
        </div>
    )
}