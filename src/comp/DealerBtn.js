import React from "react";

export default function DealerBtn(props) {
    return (
        <div
            className={
                props.player == "computer"
                    ? "dealer-btn dealer-top"
                    : "dealer-btn dealer-bottom"
            }
        >
            <span>D</span>
        </div>
    );
}
