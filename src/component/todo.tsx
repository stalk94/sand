import React, { useState } from "react";

import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';
import { fetchApi, useInfoToolbar } from "../engineHooks";
import { DndContext } from "@dnd-kit/core";
import {SortableContext} from '@dnd-kit/sortable';

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";

import "./../style/todo.scss";

interface IList {
    title: string;
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

    fetchApi("getTodo", {}, (data) => {
        globalState.user.todo.set(data);
    });

    const todo = useHookstate(globalState.user.todo);

    const setServerData = (path, data) => {
        fetchApi(path, data, (val) => {
            if (val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else todo.set(val);
        });
    }

    const drawBoard = (lists) => {
        return (
            <React.Fragment>
                {lists.map((list: IList) => {
                    return (
                        <Panel headerTemplate={headerTemplate(list.title, list.id, setServerData)} key={list.id}>
                            <SortableContext items={list.cards.map((card) => card.index)}>
                                {list.cards && list.cards.map((card: ICard, id: number) => {
                                    return (
                                        <Card className="card" title={card.content.title} subTitle={card.content.text} key={id}/>
                                    )
                                })}
                            </SortableContext>
                            <CardForm listId={list.id} setData={setServerData} />
                        </Panel>
                    )
                })}
            </React.Fragment>    
        )
    }

    return (
        <DndContext>
            <div className="board">
                {drawBoard(todo.column.get())}
                <ListForm setData={setServerData} />
            </div>
        </DndContext>
    )
}

const ListForm = (props: {setData: Function}) => {
    const {setData} = props;
    const [isCreateListForm, setIsCreateListForm] = useState<boolean>(false);
    const [listTitle, setListTitle] = useState<string>('');

    return (
        <React.Fragment>
            {isCreateListForm ?   
                <form className="list-form">
                    <InputText onChange={(e) => {setListTitle(e.target.value)}}/>
                    <div className="form-buttons__container">
                        <Button label="confirn" onClick={((e) => {
                                e.preventDefault();
                                setData('addColumn', {column: {title: listTitle}});
                                setIsCreateListForm(!isCreateListForm)
                                setListTitle("");
                            })
                        }/>
                        <Button label="cancel" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
                    </div>
                </form>
                :
                <Button className="toggle-button" label="Create new list" onClick={((e) => setIsCreateListForm(!isCreateListForm))}/>
            }
        </React.Fragment>
    )
}

const CardForm = (props: {listId: number, setData: Function}) => {
    const {listId, setData} = props;
    const [isCreateCardForm, setIsCreateCardForm] = useState<boolean>(false);
    const [cardTitle, setCardTitle] = useState<string>("");

    return (
        <React.Fragment>
            {isCreateCardForm ? 
                <form className="card-form">
                    <InputText  onChange={(e) => {setCardTitle(e.target.value)}}/>
                    <div className="form-buttons__container">
                        <Button label="confirm" onClick={((e) => {
                                e.preventDefault();
                                setData("addCard", {card: {
                                        parentId: listId,
                                        content: {title: cardTitle},
                                    }}
                                );
                                setIsCreateCardForm(!isCreateCardForm);
                                setCardTitle("");
                                
                            }
                        )}/>
                        <Button label="cancel" onClick={(() => setIsCreateCardForm(!isCreateCardForm))}/>
                    </div>
                </form>
                : 
                <Button label="Create new card" onClick={(() => setIsCreateCardForm(!isCreateCardForm))}/>
            }
        </React.Fragment>
    )
}

const headerTemplate = (listTitle: string, listId: number, buttonOption: Function) => {
    return (
        <div className="list__header-template">
            <h2>{listTitle}</h2>
            <button onClick={() => buttonOption("delColumn", {id: listId})}><i className="pi pi-times"></i></button>
        </div>
    );
}