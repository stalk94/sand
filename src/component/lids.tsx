import React, { ReactElement, useState } from "react";
import globalState from "../global.state";

import "./../style/lids.scss";

interface ICustomSelect {
    options: Array<string | ReactElement>;
    isOpen: boolean;
    onSelect: (option: string | ReactElement) => void;
    toggleSelect: () => void;
}


export default function Lids() {
    const lids = globalState.lids;


    return (
        <React.Fragment>
            <Sidebar groups={lids.groups}/>
            <div className="lids__page">
                <div className="header">
                    <CustomLabel text="Hello User!" style="gray size__large weight__semi-bold" />
                    <Search style="wheat"/>
                </div>
                <CustomersWidget/>
            </div>
        </React.Fragment>
    )
}

const Sidebar = (props: {groups}) => {
    const {groups} = props;

    const drawGroups = (groups: Array<string>) => {
        return groups.map((group: string) => {
            return (
                <li className="nav__item">
                    <button>{group}</button>
                </li>
            )
        }) 
    }

    const createNewGroup = (name: string) => {
        
    }

    return (
        <div className="sidebar">
            <div className="sidebar__container">
                <nav className="sidebar__nav">
                    <h2 className="nav__title">Lid Groups</h2>
                    <ul>
                        {drawGroups(groups.get())}
                    </ul>
                    <button className="create-item">Create new Group</button>
                </nav>
            </div>
        </div>
    )
}

const CustomersWidget = () => {

    const playersText = ["newest", "oldest", "something1", "something3", "something3"];
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectStates, setSelectStates] = useState([false, false]);

    const toggleSelect = (index: number) => {
        const updatedStates = selectStates.map((state, i) => (i === index ? !state : false));
        setSelectStates(updatedStates);
    };

    const handleSelect = (value: any) => {
        setSelectedValue(value);
    };
    
    return (
        <div className="customers-widget">
            <div className="widget__container">
                <div className="customers-widget__header">
                    <div className="header__left">
                        <CustomLabel text="All Customers" style="weight__semi-bold size__big"/>
                        <CustomLabel text="Active Members" style="green"/>
                    </div>
                    <div className="header__right">
                        <Search style="wheat" />
                        <Filter 
                            options={playersText} 
                            onSelect={handleSelect} 
                            isOpen={selectStates[0]} 
                            toggleSelect={() => toggleSelect(0)}
                        />
                    </div>
                </div>

                <CustomerTable />

                <div className="customers-widget__footer">
                    <CustomLabel text="Showing data 1 to 8 of 256k entries" style="gray" />
                    <Paginator />
                </div>
            </div>
        </div>
    )
}

const Filter = (props: ICustomSelect) => {

    const { options, onSelect, isOpen, toggleSelect } = props;
    const [selectedOption, setSelectedOption] = useState(options[0]);
    
    const handleOptionClick = (option: string | ReactElement) => {
        setSelectedOption(option);
        onSelect(option);
        toggleSelect();
        
    };

    return (
        <div className="filter">
            <div className={`custom-select ${isOpen ? "active" : ""}`}>
                <div className={`selected-value ${isOpen ? "active" : ""}`} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSelect();
                    }
                }>
                    <span>
                        <CustomLabel text="Sort by:" style="gray" /> 
                        <CustomLabel text={selectedOption} style="weight__semi-bold size__small"/>
                    </span>
                    {/* <img className="arrow" src={arrow}  alt="#"/> */}
                </div>
                <ul className={`options-list ${isOpen ? "open" : ""}`}>
                    {options.map((option: string | ReactElement, index: number) => (
                        <li key={index} onClick={() => handleOptionClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const Search = (props: {style?: string}) => {
    const {style} = props;
    return (
        <div className={`search ${style ? style :  ""}`}>
            {/* <img src={search} /> */}
            <input type="text" placeholder="Search"/>
        </div>
    )
}

const Paginator = () => {
    const [totalCount, setTotalCount] = useState<number>(40);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagesStep, setPagesStep] = useState<number>(4);

    const pageBtns = (currentPage: number, pagesStep: number) => {
        for (let i = currentPage; i <=pagesStep; i++) {
            
        }
    }

    return (
        <div className="paginator">
            {/* <button className="previous"><img src={arrow} alt="#" /></button> */}
            <button><CustomLabel text="1" /></button>
            <button><CustomLabel text="2" /></button>
            <button><CustomLabel text="3" /></button>
            <button><CustomLabel text="4" /></button>
            <CustomLabel text="..." style="size__small weight__medium" />
            <button className="last"><CustomLabel text={totalCount + ''} style="size__small weight__medium" /></button>
            {/* <button className="next"><img src={arrow} alt="#" /></button> */}
        </div>
    )
}

const CustomerTable = () => {
    return (
        <table className="table">
            <TableHeader />
            <tbody className="table__body">
                <TableLine />
                <TableLine />
                <TableLine />
                <TableLine />
                <TableLine />
                <TableLine />
            </tbody>
        </table>
    )
}

const TableHeader = () => {
    return (
        <thead className="table__header">
            <tr>
                <th className="table-cell" ><CustomLabel text="Customer Name" style="gray" /></th>
                <th className="table-cell" ><CustomLabel text="Company" style="gray" /></th>
                <th className="table-cell" ><CustomLabel text="Phone Number" style="gray" /></th>
                <th className="table-cell" ><CustomLabel text="Email" style="gray" /></th>
                <th className="table-cell" ><CustomLabel text="Country" style="gray" /></th>
                <th className="table-cell" ><CustomLabel text="Status" style="gray" /></th>
            </tr>
        </thead>
    )
}

const TableLine = () => {
    return (
        <tr className="table-line">
            <td className="table-cell" ><CustomLabel text="Jane Cooper" style="weight__medium" /></td>
            <td className="table-cell" ><CustomLabel text="Microsoft" style="weight__medium" /></td>
            <td className="table-cell" ><CustomLabel text="(225) 555-0118" style="weight__medium" /></td>
            <td className="table-cell" ><CustomLabel text="jane@microsoft.com" style="weight__medium" /></td>
            <td className="table-cell" ><CustomLabel text="United States" style="weight__medium" /></td>
            <td className="table-cell" ><CustomerButton/></td>
        </tr>
    )
}

const CustomerButton = (props: {handler?: Function}) => {
    const {handler} = props;
    const [isActive, setIsActive] = useState<boolean>(false);

    const buttonHandler = () => {
        setIsActive(!isActive);
        if (handler) {
            handler();
        }
    }

    return <button 
        className={`customer-button ${isActive ? "active" : ""}`} 
        onClick={buttonHandler}
    >
        <p>{isActive ? "active" : "inactive"}</p> 
    </button>
}

const CustomLabel = (props: {text: string | ReactElement, style?: string}) => {
    const {text, style} = props;

    return (
        <p className={`custom-label ${style ? style : ''}`}>{text}</p>
    )
}