import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
    updateHumanChips,
    updateComputerChips,
    updateGameplay,
    newHand,
    updateGameState,
    setPlayer,
    setHandWinner,
    AI_MOVE,
} from "../redux/actions/userActions";
import useSound from "use-sound";
import checkSound from "../sound/check.wav";
import chipSound from "../sound/chips.wav";
function BettingUI(props) {
    const [betAmount, setBetAmount] = useState(100);
    const [callAmount, setCallAmount] = useState(50);
    const [prevAction, setPrevAction] = useState("");
    const [showCheck, setShowCheck] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showBet, setShowBet] = useState(false);
    const [showRaise, setShowRaise] = useState(false);
    // const [playerTurn, setPlayerTurn] = useState("human");

    useEffect(() => {
        console.log(props.user.playerTurn);
        // update Game State when playerTurn changes to computer or human
        if (props.user.playerTurn == "") {
            props.updateGameState(
                props.user.smallBlind,
                props.user.playerTurn,
                props.user.prevAction,
                props.user.gameState
            );
        }

        // setPlayerTurn(props.user.playerTurn);
        // if (props.user.gameState == "showdown") {
        //     setPlayerTurn("");
        // }
    }, [props.user.playerTurn]);

    // Ensure correct player turn each gameState

    useEffect(() => {
        let smallBlind = props.user.smallBlind;
        let bigBlind =
            props.user.smallBlind == "computer" ? "human" : "computer";

        if (props.user.gameState == "preflop") {
            // props.setPlayer(smallBlind);
        } else if (props.user.gameState != "showdown") {
            props.setPlayer(bigBlind);
        }
    }, [props.user.gameState, props.user.smallBlind]);

    // If computer turn first, initiate gameplay
    useEffect(() => {
        console.log(props.user.prevAction);
        if (
            props.user.gameState == "preflop" &&
            props.user.smallBlind == "computer" &&
            props.user.playerTurn == "computer" &&
            (props.user.prevAction == "" || props.user.prevAction == "bet")
        ) {
            console.log(props.user.prevAction);
            // computer auto call
            props.AI_MOVE(
                "computer",
                props.user.smallBlind,
                "call",
                props.user.prevAction,
                props.user.pot,
                prevAction == "" ? 50 : betAmount,
                props.user.gameState,
                props.user.computerChips
            );
            // props.updateComputerChips(props.user.computerChips, "lose", 50);
        }
        // preflop AI BB
        if (
            props.user.gameState == "preflop" &&
            props.user.smallBlind == "human" &&
            props.user.playerTurn == "computer"
        ) {
            // computer auto call
            props.AI_MOVE(
                "computer",
                props.user.smallBlind,
                "call",
                props.user.prevAction,
                props.user.pot,
                // just tweaked
                prevAction == "call" ? 50 : 50 + betAmount,
                props.user.gameState,
                props.user.computerChips
            );
            // props.updateComputerChips(props.user.computerChips, "lose", 50);
        }
        if (
            props.user.gameState != "preflop" &&
            props.user.gameState != "showdown" &&
            props.user.playerTurn == "computer"
        ) {
            console.log(prevAction);
            props.AI_MOVE(
                "computer",
                props.user.smallBlind,
                "",
                props.user.prevAction,
                props.user.pot,
                props.user.prevAction == "check" ? 0 : betAmount,
                props.user.gameState,
                props.user.computerChips
            );
        }
    }, [props.user.playerTurn]);

    // Check which UI buttons to show, depending on prevAction
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
        } else if (prevAction == "check") {
            setShowCall(false);
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
            (props.user.smallBlind == "human" &&
                prevAction == "" &&
                props.user.gameState == "preflop")
        ) {
            setShowRaise(true);
        } else {
            setShowRaise(false);
        }
    }, [props.user.prevAction, props.user.smallBlind]);

    //Keep local track of prevAction
    useEffect(() => {
        if (props.user.prevAction == "check") {
            playCheck();
        }
        if (
            props.user.prevAction == "bet" ||
            props.user.prevAction == "raise" ||
            props.user.prevAction == "call"
        ) {
            playChips();
        }
        setPrevAction(props.user.prevAction);
        setCallAmount(props.user.computerBet);
        // console.log(prevAction);
    }, [props.user.prevAction]);

    const [playCheck] = useSound(checkSound, { volume: 0.5 });
    const [playChips] = useSound(chipSound, { volume: 0.8 });

    // At end of showdown, deal new hand
    useEffect(() => {
        if (props.user.gameState == "showdown") {
            // setPlayerTurn("computer");
            setTimeout(() => props.newHand(props.user.smallBlind), 4000);
        }
        if (props.user.gameState == "preflop") {
            // setPlayerTurn(props.user.smallBlind);
            setCallAmount(50);
        }
    }, [props.user.gameState]);

    // set smallblind within component state and global state
    useEffect(() => {
        if (props.user.gameState == "preflop") {
            props.setPlayer(props.user.smallBlind);
            // setPlayerTurn(props.user.smallBlind);
        }
    }, [props.user.smallBlind]);

    return (
        <div
            className="betting-ui"
            style={
                props.user.playerTurn == "computer" ||
                props.user.playerTurn == "" ||
                props.user.gameState == "showdown" ||
                (props.user.smallBlind == "computer" &&
                    props.user.gameState == "preflop" &&
                    props.user.prevAction == "")
                    ? { visibility: "hidden" }
                    : {}
            }
        >
            <div className="betting-ui-btns">
                <button
                    onClick={() => {
                        props.newHand(props.user.smallBlind);
                        props.setHandWinner(
                            "computer",
                            props.user.computerChips,
                            props.user.pot,
                            `Computer wins ${props.user.pot}`
                        );
                    }}
                >
                    Fold
                </button>
                {showCheck && (
                    <button
                        onClick={() => {
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "check",
                                prevAction,
                                props.user.pot,
                                0,
                                props.user.gameState,
                                props.user.computerChips
                            );
                        }}
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
                                props.user.prevAction,
                                props.user.pot,
                                Number(callAmount),
                                props.user.gameState,
                                props.user.computerChips
                            );
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
                                props.user.smallBlind,
                                "raise",
                                prevAction,
                                props.user.pot,
                                Number(callAmount + betAmount),
                                props.user.gameState,
                                props.user.computerChips
                            );
                        }}
                    >
                        <span>Raise</span>
                        <span>
                            {props.user.gameState == "preflop" &&
                            props.user.prevAction == ""
                                ? 150
                                : Number(callAmount) * 2}
                        </span>
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
    updateComputerChips,
    updateGameplay,
    updateGameState,
    setPlayer,
    setHandWinner,
    AI_MOVE,
};
export default connect(mapStateToProps, mapActionsToProps)(BettingUI);
