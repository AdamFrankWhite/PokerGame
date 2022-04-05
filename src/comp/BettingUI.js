import React, { useEffect } from "react";
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
    const [action, setAction] = useState("");

    useEffect(() => {
        setAction(props.user.prevAction);
    }, [props.user.prevAction]);
    return (
        <div className="betting-ui">
            <div className="betting-ui-btns">
                <button onClick={() => props.newHand()}>Fold</button>
                {(action == "" || action == "call") && (
                    <button
                        onClick={() =>
                            props.updateGameplay(
                                "human",
                                "check",
                                action,
                                props.user.pot,
                                0
                            )
                        }
                    >
                        Check
                    </button>
                )}
                {(action == "" || action == "check" || action == "call") && (
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
                                action,
                                props.user.pot,
                                Number(betAmount)
                            );
                        }}
                    >
                        <span>Bet</span>
                        <span>{betAmount}</span>
                    </button>
                )}
                {action == "bet" ||
                    action == "raise" ||
                    (props.user.smallBlind == "human" &&
                        props.user.gameState == "preflop" && (
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
                                        action,
                                        props.user.pot,
                                        Number(callAmount)
                                    );
                                }}
                            >
                                Call
                            </button>
                        ))}
                {action == "bet" ||
                    (props.user.smallBlind == "human" &&
                        props.user.gameState == "preflop" && (
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
                                        action,
                                        props.user.pot,
                                        Number(callAmount + betAmount)
                                    );
                                }}
                            >
                                Raise
                            </button>
                        ))}
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
