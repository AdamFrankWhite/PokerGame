import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { updateHumanChips } from "../redux/actions/userActions";
function BettingUI(props) {
    const [betAmount, setBetAmount] = useState(100);
    return (
        <div className="betting-ui">
            <div className="betting-ui-btns">
                <button onClick={() => props.newHand()}>Fold</button>
                <button
                    onClick={() =>
                        props.updateHumanChips(
                            props.user.humanChips,
                            "lose",
                            betAmount
                        )
                    }
                >
                    Bet
                </button>
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
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapActionsToProps = {
    updateHumanChips,
};
export default connect(mapStateToProps, mapActionsToProps)(BettingUI);
