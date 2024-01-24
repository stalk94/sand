import React from "react";
import { Card } from "primereact/card";

export default function ToDo() {

    return (
        <div className="board" style={{width: '100%', height: "100%", display: "flex", flexDirection: "row", gap: "20px", margin: "20px"}}>
            <div className="list" style={{width: 'fit-content', height: "fit-content", display: "flex", flexDirection: "column", gap: "10px"}}>
                <Card className="w-80" title="Hello admin" subTitle="lorem ipsum lskdjfklsjdfljsdlkfjskld"/>
                <Card className="w-80" title="Hello admin" subTitle="lorem ipsum lskdjfklsjdfljsdlkfjskld"/>
                <Card className="w-80" title="Hello admin" subTitle="lorem ipsum lskdjfklsjdfljsdlkfjskld"/>
            </div>
        </div>
    )
}