import React from "react";
import avatar1 from "../img/avatar-1.png";
import avatar2 from "../img/avatar-2.png";
export default function Avatar(props) {
    return (
        <div className={"avatar " + props.id}>
            <img
                src={props.player == "computer" ? avatar1 : avatar2}
                alt="avatar"
            />
            <div className="avatar-text">
                <p className="chip-count">{props.chips}</p>
                <h2>{props.player}</h2>
            </div>
        </div>
    );
}
