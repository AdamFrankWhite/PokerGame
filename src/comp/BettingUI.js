import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
    updateHumanChips,
    updateGameplay,
    newHand,
    updateGameState,
    setPlayer,
} from "../redux/actions/userActions";
function BettingUI(props) {
    const [betAmount, setBetAmount] = useState(100);
    const [callAmount, setCallAmount] = useState(50);
    const [prevAction, setPrevAction] = useState("");
    const [showCheck, setShowCheck] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showBet, setShowBet] = useState(false);
    const [showRaise, setShowRaise] = useState(false);
    const [playerTurn, setPlayerTurn] = useState("human");
    // useEffect(() => {
    //     // get hand started if computer SB
    //     if (props.user.smallBlind == "computer") {
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
    // Check which buttons to show

    useEffect(() => {
        // update Game State when playerTurn changes to computer or human
        if (props.user.playerTurn != "") {
            props.updateGameState(
                props.user.smallBlind,
                props.user.playerTurn,
                props.user.prevAction,
                props.user.gameState
            );
        }

        setPlayerTurn(props.user.playerTurn);
        if (props.user.gameState == "showdown") {
            setPlayerTurn("");
        }
    }, [props.user.playerTurn]);

    // Ensure correct player turn each gameState

    useEffect(() => {
        let smallBlind = props.user.smallBlind;
        let bigBlind =
            props.user.smallBlind == "computer" ? "human" : "computer";

        if (props.user.gameState == "preflop") {
            props.setPlayer(smallBlind);
            console.log(59);
        } else if (props.user.gameState != "showdown") {
            // props.setPlayer("");
            console.log(62);
            props.setPlayer(bigBlind);
        }
    }, [props.user.gameState]);

    useEffect(() => {
        if (
            props.user.gameState == "preflop" &&
            props.user.smallBlind == "computer" &&
            props.user.playerTurn == "computer"
        ) {
            console.log(prevAction);
            props.updateGameplay(
                "computer",
                props.user.smallBlind,
                "",
                prevAction,
                150,
                50,
                "preflop"
            );
        }

        if (
            props.user.gameState != "preflop" &&
            props.user.prevAction == "" &&
            props.user.playerTurn == "computer"
        ) {
            console.log(prevAction);
            props.updateGameplay(
                "computer",
                props.user.smallBlind,
                "",
                prevAction,
                props.user.pot,
                0,
                "preflop"
            );
        }
    }, [props.user.playerTurn]);
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

        if (props.user.gameState == "showdown") {
        }
    }, [props.user.prevAction, props.user.smallBlind]);

    useEffect(() => {
        setPrevAction(props.user.prevAction);
        // console.log(prevAction);
    }, [props.user.prevAction]);

    useEffect(() => {
        if (props.user.gameState == "showdown") {
            setPlayerTurn("computer");
            setTimeout(() => props.newHand(props.user.smallBlind), 4000);
        }
        if (props.user.gameState == "preflop") {
            setPlayerTurn(props.user.smallBlind);
        }
    }, [props.user.gameState]);

    useEffect(() => {
        if (props.user.gameState == "preflop") {
            props.setPlayer(props.user.smallBlind);
            setPlayerTurn(props.user.smallBlind);
        }
    }, [props.user.smallBlind]);
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
        <div
            className="betting-ui"
            style={
                playerTurn == "computer" || playerTurn == ""
                    ? { visibility: "hidden" }
                    : {}
            }
        >
            <div className="betting-ui-btns">
                <button
                    onClick={() =>
                        props.newHand(
                            props.user.smallBlind,
                            props.user.pot,
                            "computer"
                        )
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
                                props.user.gameState,
                                props.user.computerChips
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
                            // setCallAmount("");
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
                        <span>Raise</span>
                        <span>{Number(callAmount) + Number(betAmount)}</span>
                    </button>
                )}
            </div>
            <div class="slidecontainer">
                <input
                    type="range"
                    min="100"
                    max={props.chips}
                    value={betAmount}
                    class="slider"
                    id="myRange"
                    onChange={(e) => setBetAmount(e.target.value)}
                />
            </div>
            {/* <p className="bet-amount">{betAmount}</p> */}
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
    updateGameState,
    setPlayer,
};
export default connect(mapStateToProps, mapActionsToProps)(BettingUI);
