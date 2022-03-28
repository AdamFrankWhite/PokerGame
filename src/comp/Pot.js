import React from "react";
import chipsImage from "../img/icons8-casino-chips-66.png";
export default function Pot() {
    return (
        <div className="pot">
            <img src={chipsImage} />
            <span>100</span>
        </div>
    );
}
