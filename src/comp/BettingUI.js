import React from "react";
import { useState } from "react";
export default function BettingUI(props) {
    const [betAmount, setBetAmount] = useState(100);
    return (
        <div className="betting-ui">
            <div className="betting-ui-btns">
                <button>Fold</button>
                <button>Bet</button>
                <button>Call</button>
                <button>Raise</button>
            </div>
            <div class="slidecontainer">
                <input
                    type="range"
                    min="1"
                    max={props.chips}
                    value={betAmount}
                    class="slider"
                    id="myRange"
                    onChange={(e) => setBetAmount(e.target.value)}
                />
            </div>
            <p>{betAmount}</p>
        </div>
    );
}
