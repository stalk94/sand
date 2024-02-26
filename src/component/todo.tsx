import React, { useEffect, useMemo, useState } from "react";

import globalState from "../global.state";
import { useHookstate } from '@hookstate/core';
import { fetchApi, useInfoToolbar } from "../engineHooks";
import { 
    DndContext, 
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
    const columnIdes = useMemo(() => todo.column.get().map((col) => col.id), [todo.column, columns]);

    const setServerData = (path, data) => {
        fetchApi(path, data, (val) => {
            if (val.error) useInfoToolbar("error", 'Ошибка', val.error);
            else todo.set(val);
        });
    }

    
    useEffect(() => {
        setColumns(JSON.parse(JSON.stringify(todo.column.get())));
    }, [todo]);
    
    useDidMount(() => {
        fetchApi("getTodo", {}, (data) => {
            todo.set(data);
        })
    });
    
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

    const onDragOver = (event: DragOverEvent, setData: Function) => {
        const dragObj = event.active.data.current;
        const { active, over } = event;

        if (!over) return;

        if (active.id === over.id) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";

        if (!isActiveACard) return;

        if (isActiveACard && isOverACard) {
            const activeParentId = active.data.current?.card.parentId; 
            const overParentId = over.data.current?.card.parentId; 

            if (activeParentId !== overParentId) {
                setColumns((columns) => {
                    columns[activeParentId - 1].cards.splice(active.data.current?.card.index - 1, 1);
                    columns[activeParentId - 1].cards = columns[activeParentId - 1].cards.map((card, index) => {
                        card.index = index + 1;
                        return card;
                    });
                    active.data.current!.card.parentId = overParentId;
                    columns[overParentId - 1].cards.splice(over.data.current?.card.index - 1, 0, active.data.current!.card);
                    columns[overParentId - 1].cards = columns[overParentId - 1].cards.map((card, index) => {
                        card.index = index + 1
                        return card;
                    });
                    return columns;
                });
            }
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveACard && isOverAColumn) {
            const activeParentId = active.data.current?.card.parentId; 
            const overParentId = over.data.current?.column.id;

            setColumns((columns) => {
                columns[activeParentId - 1].cards.splice(active.data.current?.card.index - 1, 1);
                columns[activeParentId - 1].cards = columns[activeParentId - 1].cards.map((card, index) => {
                    card.index = index + 1;
                    return card;
                });
                active.data.current!.card.parentId = overParentId;
                active.data.current!.card.index = columns[overParentId - 1].cards.length + 1;
                columns[overParentId - 1].cards.splice(active.data.current!.card.index, 0, active.data.current!.card);
                
                return columns;
            });
            console.log(columns);
        }
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

            if (active.id === over.id) {
                setActiveCard(null);
                return;
            }

            const dragOverType = over.data.current?.type;

            if (dragOverType === "Card") {
                const activeParentId = active.data.current?.card.parentId;
                const overParentId = over.data.current?.card.parentId;
                if (activeParentId === overParentId) {
                    setColumns((columns) => {
                        const activeCardIndex = columns[activeParentId - 1].cards.findIndex((card) => card.index === active.data.current!.card.index);
                        const overCardIndex = columns[activeParentId - 1].cards.findIndex((card) => card.index === over.data.current!.card.index);
                        columns[activeParentId - 1].cards = arrayMove(columns[activeParentId - 1].cards, activeCardIndex, overCardIndex);
                        columns[overParentId - 1].cards = columns[overParentId - 1].cards.map((card, index) => {
                            card.index = index + 1
                            return card;
                        });
                        return columns;
                    });
                }
                console.log(columns[2].cards);
                setData("updateBoard", {columns: JSON.stringify(columns)});
            }

            if (dragOverType === "Column") {
                setData("updateBoard", {columns: JSON.stringify(columns)});
            }


            setActiveCard(null)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={(e) => onDragEnd(e, setServerData)}
            onDragOver={(e) => onDragOver(e, setServerData)}
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
    const cardsIdes = useMemo(() => column.cards.map((col) => col.id), [column.cards])

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