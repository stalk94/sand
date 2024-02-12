import React, { useEffect, useMemo, useState } from "react";

import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';
import { fetchApi, useInfoToolbar } from "../engineHooks";
import { DndContext, useDroppable, useDraggable, DragStartEvent, DragOverlay } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import "./../style/todo.scss";

interface IColumn {
    title: string;
    id: number;
    index: number;
    cards: ICard[];
}

interface ICard {
    id: number;
    index: number;
    content: {
        title: string;
        text: string;
    };
}

export default function ToDo() {
    
    const todo = useHookstate(globalState.user.todo);
    const columnIdes = useMemo(() => todo.column.get().map((col) => col.id), todo.column);
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);

    const setServerData = (path, data) => {
        fetchApi(path, data, (val) => {
            if (val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else todo.set(val);
        });
    }

    useEffect(() => {
        fetchApi("getTodo", {}, (data) => {
            console.log(data);
            globalState.user.todo.set(data);
        });
    }, []);
    
    const drawColumns = (columns) => {
        return (
            <React.Fragment>
                <SortableContext items={columnIdes}>
                    {columns.map((column: IColumn) => {
                        return <Column column={column} setData={setServerData} key={column.id} />
                    })}
                </SortableContext>
            </React.Fragment>    
        )
    }

    const onDragStart = (event: DragStartEvent) => {
        const dragObj = event.active.data.current;
        if (dragObj?.type === "Column") setActiveColumn(dragObj?.column)
    }

    return (
        <DndContext onDragStart={onDragStart}>
            <div className="board">
                {drawColumns(todo.column.get())}
                <ColumnForm setData={setServerData} />
            </div>
            <DragOverlay>
                {activeColumn && <Column column={activeColumn} setData={setServerData} />}
            </DragOverlay>
        </DndContext>
    )
}

//---------------------COLUMN_FORM--------------------------------

const ColumnForm = (props: {setData: Function}) => {
    const {setData} = props;
    const [isCreateColumnForm, setIsCreateColumnForm] = useState<boolean>(false);
    const [columnTitle, setColumnTitle] = useState<string>('');

    return (
        <React.Fragment>
            {isCreateColumnForm ?   
                <form className="list-form">
                    <input onChange={(e) => {setColumnTitle(e.target.value)}}/>
                    <div className="form-buttons__container">
                        <button onClick={((e) => {
                                e.preventDefault();
                                setData('addColumn', {column: {title: columnTitle}});
                                setIsCreateColumnForm(!isCreateColumnForm)
                                setColumnTitle("");
                            })
                        }>confirm</button>
                        <button onClick={(() => setIsCreateColumnForm(!isCreateColumnForm))}>cancel</button>
                    </div>
                </form>
                :
                <button className="toggle-button" onClick={(() => setIsCreateColumnForm(!isCreateColumnForm))}>create new column</button>
            }
        </React.Fragment>
    )
}

//---------------------CARD_FORM--------------------------------

const CardForm = (props: {listId: number, setData: Function}) => {
    const {listId, setData} = props;
    const [isCreateCardForm, setIsCreateCardForm] = useState<boolean>(false);
    const [cardTitle, setCardTitle] = useState<string>("");

    return (
        <React.Fragment>
            {isCreateCardForm ? 
                <form className="card-form">
                    <input  onChange={(e) => {setCardTitle(e.target.value)}}/>
                    <div className="form-buttons__container">
                        <button onClick={((e) => {
                                e.preventDefault();
                                setData("addCard", {card: {
                                        parentId: listId,
                                        content: {title: cardTitle},
                                    }}
                                );
                                setIsCreateCardForm(!isCreateCardForm);
                                setCardTitle("");
                                
                            }
                        )}>confirm</button>
                        <button onClick={(() => setIsCreateCardForm(!isCreateCardForm))}>cancel</button>
                    </div>
                </form>
                : 
                <button className="create-card__button" onClick={(() => setIsCreateCardForm(!isCreateCardForm))}>create new card</button>
            }
        </React.Fragment>
    )
}

//-------------------------CARD---------------------------------

const Card = (props: {card: ICard}) => {
    const {card} = props;

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: card.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div 
            className="card"
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
        >
            <h3>{card.content.title}</h3>
        </div>
    );
}

// -------------------------COLUMN------------------------------------

const Column = (props: {column: IColumn, setData: Function}) => {
    const {column, setData} = props;

    const { setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="column active"
            ></div>
        )
    }

    return (
        <div 
            className="column"
            ref={setNodeRef} 
            style={style}
        >
            <div 
                className="column__header-template"
                {...attributes}
                {...listeners}
            >
                <h2>{column.title}</h2>
                <button onClick={() => setData("delColumn", {id: column.id})}><i className="pi pi-times"></i></button>
            </div>
            {column.cards && column.cards.map((card) => {
                return <Card key={card.id} card={card} />   
            })}
            <CardForm listId={column.id} setData={setData} />
        </div>
    )
}