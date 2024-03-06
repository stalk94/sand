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
    parentIndex: number;
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
        const { active, over } = event;

        if (!over) return;

        if (active.id === over.id) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";

        if (!isActiveACard) return;

        if (isActiveACard && isOverACard) {
            const activeParentIndex = active.data.current?.card.parentIndex; 
            const overParentIndex = over.data.current?.card.parentIndex; 

            if (activeParentIndex !== overParentIndex) {
                setColumns((columns) => {
                    columns[activeParentIndex].cards.splice(active.data.current?.card.index, 1);
                    columns[activeParentIndex].cards = columns[activeParentIndex].cards.map((card, index) => {
                        card.index = index;
                        return card;
                    });
                    active.data.current!.card.parentIndex = overParentIndex;
                    columns[overParentIndex].cards.splice(over.data.current?.card.index, 0, active.data.current!.card);
                    columns[overParentIndex].cards = columns[overParentIndex].cards.map((card, index) => {
                        card.index = index;
                        return card;
                    });
                    return columns;
                });
            }
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveACard && isOverAColumn) {
            const activeParentIndex = active.data.current?.card.parentIndex; 
            const overParentIndex = over.data.current?.column.index;

            setColumns((columns) => {
                columns[activeParentIndex].cards.splice(active.data.current?.card.index, 1);
                columns[activeParentIndex].cards = columns[activeParentIndex].cards.map((card, index) => {
                    card.index = index;
                    return card;
                });
                active.data.current!.card.parentIndex = overParentIndex;
                active.data.current!.card.index = columns[overParentIndex].cards.length;
                columns[overParentIndex].cards.splice(active.data.current!.card.index, 0, active.data.current!.card);
                
                return columns;
            });
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

            if (over.data.current?.type === "Column") {
                setColumns((columns) => {
                    const activeColumnIndex = active.data.current?.column.index;
                    const overColumnIndex = over.data.current?.column.index;
                    [columns[activeColumnIndex], columns[overColumnIndex]] = [columns[overColumnIndex], columns[activeColumnIndex]];
                    columns[activeColumnIndex].index = activeColumnIndex;
                    columns[overColumnIndex].index = overColumnIndex;
                    columns[activeColumnIndex].cards = columns[activeColumnIndex].cards.map((card) => {
                        card.parentIndex = activeColumnIndex;
                        return card;
                    })
                    columns[overColumnIndex].cards = columns[overColumnIndex].cards.map((card) => {
                        card.parentIndex = overColumnIndex;
                        return card;
                    })
                    return columns;
                });
                setData("updateBoard", {columns: JSON.stringify(columns)});
            }

            setActiveColumn(null)
        } 

        if (dragObj?.type === "Card") {

            if (active.id === over.id) {
                setData("updateBoard", {columns: JSON.stringify(columns)});
                setActiveCard(null);
                return;
            }

            const dragOverType = over.data.current?.type;

            if (dragOverType === "Card") {
                const activeParentIndex = active.data.current?.card.parentIndex;
                const overParentIndex = over.data.current?.card.parentIndex;
                if (activeParentIndex === overParentIndex) {
                    setColumns((columns) => {
                        const activeCardIndex = columns[activeParentIndex].cards.findIndex((card) => card.index === active.data.current!.card.index);
                        const overCardIndex = columns[activeParentIndex].cards.findIndex((card) => card.index === over.data.current!.card.index);
                        columns[activeParentIndex].cards = arrayMove(columns[activeParentIndex].cards, activeCardIndex, overCardIndex);
                        columns[overParentIndex].cards = columns[overParentIndex].cards.map((card, index) => {
                            card.index = index;
                            return card;
                        });
                        return columns;
                    });
                }
                setData("updateBoard", {columns: JSON.stringify(columns)});
            }

            if (dragOverType === "Column") {
                setData("updateBoard", {columns: JSON.stringify(columns)});
            }


            setActiveCard(null)
        }
    }

    return (
        <React.Fragment>
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
            <ModalWindow/>
        </React.Fragment>
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

const CardForm = (props: {columnIndex: number, setData: Function}) => {
    const {columnIndex, setData} = props;
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
                                        parentIndex: columnIndex,
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
            onClick={() => globalState.user.modalVisibility.set(true)}
        >
            <h3>{card.content.title}</h3>
        </div>
    );
}

// -------------------------COLUMN------------------------------------

const Column = (props: {column: IColumn, setData: Function}) => {
    const {column, setData} = props;
    const cardsIdes = useMemo(() => column.cards.map((card) => card.id), [column.cards])

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
                {...listeners}
                {...attributes}
                className="column__header-template"
            >
                <h2>{column.title}</h2>
                <button onClick={() => setData("delColumn", {id: column.id})}><i className="pi pi-times"></i></button>
            </div>
            <SortableContext items={cardsIdes}>
                {column.cards && column.cards.map((card, index) => {
                    return <Card card={card} key={index} />   
                })}
            </SortableContext>
            <CardForm columnIndex={column.index} setData={setData} />
        </div>
    )
}

// ------------------------------ MODAL WINDOW ------------------------------

const ModalWindow = () => {
    const [isOpenTitleHandler, setIsOpenTitleHandler] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>("");

    return (
        <div className={`background ${!globalState.user.modalVisibility.get() ? "hidden" : "visible"}`}>
            <div className="modal-window">
                {!isOpenTitleHandler ? 
                    <h2 className="modal-window__title" onClick={() => setIsOpenTitleHandler(!isOpenTitleHandler)}>hello</h2>
                    :
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
                }
                <button className="close-btn" onClick={() => globalState.user.modalVisibility.set(false)}>close</button>
            </div>
        </div>
    )
};