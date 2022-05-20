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
    const [callAmount, setCallAmount] = useState(50);
    const [prevAction, setPrevAction] = useState("");
    const [showCheck, setShowCheck] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showBet, setShowBet] = useState(false);
    const [showRaise, setShowRaise] = useState(false);

    useEffect(() => {
        // get hand started if computer SB
        // if (props.user.smallBlind == "computer") {
        //     props.updateGameplay(
        //         "computer",
        //         props.user.smallBlind,
        //         "check",
        //         prevAction,
        //         props.user.pot,
        //         50,
        //         props.user.gameState
        //     );
        // }
    }, [props.user.smallBlind]);
    // Check which buttons to show
    useEffect(() => {
        let prevAction = props.user.prevAction;
        // Check
        // --- check for smallblind preflop cond first
        if (
            props.user.gameState == "preflop" &&
            props.user.smallBlind == "human"
        ) {
            setShowCheck(false);
        } else if (
            prevAction == "" ||
            prevAction == "check" ||
            prevAction == "call"
        ) {
            setShowCheck(true);
        } else {
            setShowCheck(false);
        }

        // Call
        if (
            prevAction == "bet" ||
            prevAction == "raise" ||
            (prevAction == "" && props.user.gameState == "preflop")
        ) {
            setShowCall(true);
        } else {
            setShowCall(false);
        }

        // Bet
        if (
            prevAction == "" &&
            props.user.smallBlind == "human" &&
            props.user.gameState == "preflop"
        ) {
            setShowBet(false);
        } else if (
            prevAction == "" ||
            prevAction == "check" ||
            prevAction == "call"
        ) {
            setShowBet(true);
        } else {
            setShowBet(false);
        }

        // Raise
        if (
            prevAction == "bet" ||
            prevAction == "raise" ||
            (props.user.smallBlind == "human" && prevAction == "")
        ) {
            setShowRaise(true);
        } else {
            setShowRaise(false);
        }
    }, [props.user.prevAction, props.user.smallBlind]);

    useEffect(() => {
        setPrevAction(props.user.prevAction);
        // console.log(prevAction);
    }, [props.user.prevAction]);

    // new hand prompt computer when dealer to begin hand betting
    // useEffect(() => {
    //     if (
    //         props.user.smallBlind == "computer" &&
    //         props.user.gameState == "preflop" &&
    //         props.user.prevAction == ""
    //     ) {
    //         props.updateGameplay(
    //             "computer",
    //             props.user.smallBlind,
    //             "call",
    //             prevAction,
    //             props.user.pot,
    //             50,
    //             props.user.gameState
    //         );
    //     }
    // }, [props.user.smallBlind]);
    return (
        <div className="betting-ui">
            <div className="betting-ui-btns">
                <button
                    onClick={() =>
                        props.newHand(props.user.smallBlind, props.user.pot)
                    }
                >
                    Fold
                </button>
                {showCheck && (
                    <button
                        onClick={() =>
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "check",
                                prevAction,
                                props.user.pot,
                                0,
                                props.user.gameState
                            )
                        }
                    >
                        Check
                    </button>
                )}

                {showBet && (
                    <button
                        onClick={() => {
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                betAmount
                            );
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "bet",
                                prevAction,
                                props.user.pot,
                                Number(betAmount),
                                props.user.gameState
                            );
                        }}
                    >
                        <span>Bet</span>
                        <span>{betAmount}</span>
                    </button>
                )}
                {showCall && (
                    <button
                        onClick={() => {
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                callAmount
                            );
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "call",
                                prevAction,
                                props.user.pot,
                                Number(callAmount),
                                props.user.gameState
                            );
                            setCallAmount("");
                        }}
                    >
                        <span>Call</span>
                        <span>{callAmount}</span>
                    </button>
                )}
                {showRaise && (
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
                                props.user.smallBlind,
                                prevAction,
                                props.user.pot,
                                Number(callAmount + betAmount),
                                props.user.gameState
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
