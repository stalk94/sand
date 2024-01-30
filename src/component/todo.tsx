import React, { useState } from "react";
import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';
import { fetchApi, useInfoToolbar } from "../engineHooks";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import "./../style/todo.css";

interface IList {
    id: number;
    index: number;
    cards: ICard[];
}

interface ICard {
    index: number;
    content: {
        title: string;
        text: string;
    };
}

export default function ToDo() {
    const todo = useHookstate(globalState.user.todo);
    const [lists, setLists] = useState(todo.column.get());

    const setServerData = (path, data) => {
        fetchApi(path, data, (val) => {
            if (val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else todo.set(val);
        });
    }

    const drawBoard = (lists) => {
        return (
            <>
                {lists.map((list: IList) => {
                    return (
                        <Panel key={list.id}>
                            {list.cards.map((card: ICard, id: number) => {
                                return <Card className="card" title={card.content.title} subTitle={card.content.text} key={id}/>
                            })}
                            {cardForm(list.id)}
                        </Panel>
                    )
                })}
            </>    
        )
    }
    const listForm = () => {
        const [isCreateListForm, setIsCreateListForm] = useState<boolean>(false);

        return (
            <>
                {isCreateListForm ?   
                    <form className="list-form">
                        <InputText />
                        <div className="form-buttons__container">
                            <Button label="confirn" onClick={((e) => {
                                    e.preventDefault();
                                    setServerData('addColumn', {column: {
                                        index: 0,
                                        cards: [{index: 0,content: {}}]
                                    }});
                                })
                            }/>
                            <Button label="cancel" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
                        </div>
                    </form>
                    :
                    <Button className="toggle-button" label="Create new list" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
                }
            </>
        )
    }
    const cardForm = (listId: number) => {
        const [isCreateCardForm, setIsCreateCardForm] = useState<boolean>(false);
    
        return (
            <>
                {isCreateCardForm ? 
                    <form className="card-form">
                        <InputText  />
                        <div className="form-buttons__container">
                            <Button label="confirm" onClick={((e) => e.preventDefault())}/>
                            <Button label="cancel" onClick={((e) => setIsCreateCardForm(!isCreateCardForm))}/>
                        </div>
                    </form>
                    : 
                    <Button label="Create new card" onClick={((e) => setIsCreateCardForm(!isCreateCardForm))}/>
                }
            </>
        )
    }

    return (
        <div className="board">
            {drawBoard(lists)}
            {listForm()}
        </div>
    )
}