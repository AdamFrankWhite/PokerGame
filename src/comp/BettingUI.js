import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
    updateHumanChips,
    updateGameplay,
    newHand,
} from "../redux/actions/userActions";
function BettingUI(props) {
    const [betAmount, setBetAmount] = useState(100);
    const [callAmount, setCallAmount] = useState(0);
    return (
        <div className="betting-ui">
            <div className="betting-ui-btns">
                <button onClick={() => props.newHand()}>Fold</button>
                {props.user.prevAction == "" && (
                    <button
                        onClick={() =>
                            props.updateGameplay(
                                "human",
                                "check",
                                props.user.prevAction,
                                props.user.pot,
                                0
                            )
                        }
                    >
                        Check
                    </button>
                )}
                {(props.user.prevAction == "" ||
                    props.user.prevAction == "check") && (
                    <button
                        onClick={() => {
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                betAmount
                            );
                            props.updateGameplay(
                                "human",
                                "bet",
                                props.user.prevAction,
                                props.user.pot,
                                Number(betAmount)
                            );
                        }}
                    >
                        <span>Bet</span>
                        <span>{betAmount}</span>
                    </button>
                )}
                {props.user.prevAction == "bet" ||
                    (props.user.prevAction == "raise" && (
                        <button
                            onClick={() => {
                                props.updateHumanChips(
                                    props.user.humanChips,
                                    "lose",
                                    betAmount
                                );
                                props.updateGameplay(
                                    "human",
                                    "call",
                                    props.user.prevAction,
                                    props.user.pot,
                                    Number(callAmount)
                                );
                            }}
                        >
                            Call
                        </button>
                    ))}
                {props.user.prevAction == "bet" && (
                    <button
                        onClick={() => {
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                Number(callAmount + betAmount)
                            );
                            props.updateGameplay(
                                "human",
                                "raise",
                                props.user.prevAction,
                                props.user.pot,
                                Number(callAmount + betAmount)
                            );
                        }}
                    >
                        Raise
                    </button>
                )}
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
    newHand,
    updateHumanChips,
    updateGameplay,
};
export default connect(mapStateToProps, mapActionsToProps)(BettingUI);
