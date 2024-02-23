import React, { useEffect, useMemo, useState } from "react";

import globalState from "../global.state";
import { ImmutableArray, useHookstate } from '@hookstate/core';
import { fetchApi, useInfoToolbar } from "../engineHooks";
import { 
    DndContext, 
    useDroppable, 
    useDraggable, 
    DragStartEvent, 
    DragOverlay, 
    DragOverEvent, 
    useSensors, 
    useSensor, 
    PointerSensor, 
    DragEndEvent 
} from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom";

import "./../style/todo.scss";
import { useDidMount } from "rooks";

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
    const [columns, setColumns] = useState<IColumn[]>(JSON.parse(JSON.stringify(todo.column.get())));
    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
    const [activeCard, setActiveCard] = useState<ICard | null>(null);
    const columnIdes = useMemo(() => todo.column.get().map((col) => col.id), [todo.column]);

    const setServerData = (path, data) => {
        fetchApi(path, data, (val) => {
            if (val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else todo.set(val);
        });
    }

    useDidMount(() => {
        fetchApi("getTodo", {}, (data) => {
            todo.set(data);
        })
    });

    useEffect(() => {
        setColumns(JSON.parse(JSON.stringify(todo.column.get())));
    }, [todo]);

    
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 3,
          },
        })
      );
    
    const drawColumns = (columns) => {
        return (
            <React.Fragment>
                <SortableContext items={columnIdes}>
                    {columns.map((column: IColumn, index: number) => {
                        return <Column key={index} column={column} setData={setServerData} />
                    })}
                </SortableContext>
            </React.Fragment>    
        )
    }

    const onDragStart = (event: DragStartEvent) => {
        const dragObj = event.active.data.current;
        if (dragObj?.type === "Column") setActiveColumn(dragObj?.column)
        if (dragObj?.type === "Card") setActiveCard(dragObj?.card)
    }

    const onDragEnd = (event: DragEndEvent, setData: Function) => {
        const dragObj = event.active.data.current;
        const { active, over } = event;

        if (!over) return;

        if (dragObj?.type === "Column") {
            
            if (active.id === over.id) {
                setActiveColumn(null);
                return;
            }

            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex((col) => col.id === active.id);
                const overColumnIndex = columns.findIndex((col) => col.id === over.id);
                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            });

            setData("swapColumns", {first: active.id, second: over.id});

            setActiveColumn(null)
        } 


        if (dragObj?.type === "Card") {
            const activeCardId = active.id; 
            const overCardId = over.id;

            if (activeCardId === overCardId) {
                setActiveCard(null);
                return;
            }


            setActiveCard(null)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={(e) => onDragEnd(e, setServerData)}
        >
            <div className="board">
                {drawColumns(columns)}
                <ColumnForm setData={setServerData} />
            </div>
            <DragOverlay>
                {activeColumn && <Column column={activeColumn} setData={setServerData} />}
                {activeCard && <Card card={activeCard} />}
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

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition
    } : undefined;

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="card active"
            ></div>
        )
    }

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
    const cardsIdes = useMemo(() => column.cards.map((col) => col.id), [column])

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
            <SortableContext items={cardsIdes}>
                {column.cards && column.cards.map((card, index) => {
                    return <Card card={card} key={index} />   
                })}
            </SortableContext>
            <CardForm listId={column.id} setData={setData} />
        </div>
    )
}