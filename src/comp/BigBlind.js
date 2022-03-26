import React from "react";

export default function BigBlind(props) {
    return (
        <div
            className={props.player == "computer" ? "bb-top" : "bb-bottom"}
        ></div>
    );
}
