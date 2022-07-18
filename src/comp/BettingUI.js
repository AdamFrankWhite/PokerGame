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
    const [raiseAmount, setRaiseAmount] = useState(150);
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
        // Set first player to go each round of betting
        if (props.user.gameState == "preflop") {
            props.setPlayer(smallBlind);
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
                props.user.smallBlind,
                props.user.prevAction,
                props.user.pot,
                props.user.prevAction == "" ? 50 : betAmount,
                props.user.gameState,
                props.user.computerChips,
                props.user.computerBet
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
                props.user.smallBlind,
                props.user.prevAction,
                props.user.pot,
                // just tweaked
                Number(raiseAmount),
                props.user.gameState,
                props.user.computerChips,
                props.user.computerBet,
                props.user.humanChips
            );
            // props.updateComputerChips(props.user.computerChips, "lose", 50);
        }
        if (
            props.user.gameState != "preflop" &&
            props.user.gameState != "showdown" &&
            props.user.playerTurn == "computer"
        ) {
            console.log("GOGOGO", props.user.computerBet);
            props.AI_MOVE(
                props.user.smallBlind,
                props.user.prevAction,
                props.user.pot,
                props.user.prevAction == "check" ? 0 : raiseAmount,
                props.user.gameState,
                props.user.computerChips,
                props.user.computerBet,
                props.user.humanChips
            );
        }
    }, [props.user.playerTurn]);

    // Check for all in
    useEffect(() => {
        if (props.user.computerChips == 0 || props.user.humanChips == 0) {
            console.log("All in");
        }
    }, [props.user.prevAction]);

    // useEffect(()=> {
    //     if (
    //         props.user.gameState != "preflop" &&
    //         props.user.gameState != "showdown" &&
    //         props.user.playerTurn == "computer"
    //     ) {
    //         console.log(prevAction);
    //         props.AI_MOVE(
    //             "computer",
    //             props.user.smallBlind,
    //             "",
    //             props.user.prevAction,
    //             props.user.pot,
    //             props.user.prevAction == "check" ? 0 : raiseAmount,
    //             props.user.gameState,
    //             props.user.computerChips,
    //             props.user.computerBet
    //         );
    //     }
    // }, [props.user.computerBet]);

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
    //Play SFX
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
    }, [props.user.prevAction]);

    // Reset raise amount new hand
    useEffect(() => {
        if (props.user.gameState == "preflop" && props.user.prevAction == "") {
            setCallAmount(50);
            setRaiseAmount(150);
        } else {
            setCallAmount(props.user.computerBet);
        }
    }, [props.user.playerTurn]);

    const [playCheck] = useSound(checkSound, { volume: 0.5 });
    const [playChips] = useSound(chipSound, { volume: 0.8 });

    // At end of showdown, deal new hand
    useEffect(() => {
        if (props.user.gameState == "showdown") {
            // setPlayerTurn("computer");
            // setTimeout(
            //     () =>
            //         props.newHand(
            //             props.user.smallBlind,
            //             props.user.humanChips,
            //             props.user.computerChips
            //         ),
            //     4000
            // );
        }

        if (props.user.prevAction == "fold") {
            props.setHandWinner(
                "human",
                props.user.humanChips,
                props.user.pot,
                `Human wins ${props.user.pot}`
            );
            props.newHand(
                props.user.smallBlind,
                props.user.humanChips + props.user.pot,
                props.user.computerChips
            );
        }

        // reset raise amounts for UI buttons new hand
        props.user.computerBet != 0
            ? setRaiseAmount(props.user.computerBet * 2)
            : setRaiseAmount(100);
        if (props.user.gameState == "preflop") {
            props.user.smallBlind == "human"
                ? setRaiseAmount(150)
                : setRaiseAmount(100);
        }
        // setCallAmount(50);
    }, [props.user.prevAction]);

    // Handle slider

    const handleSlider = (chips) => {
        // if (props.user.gameState == "preflop") {
        //     console.log(chips);
        setBetAmount(Number(chips));
        setRaiseAmount(Number(chips));
        // }
    };

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
                        props.setHandWinner(
                            "computer",
                            props.user.computerChips,
                            props.user.pot,
                            `Computer wins ${props.user.pot}`
                        );
                        props.newHand(
                            props.user.smallBlind,
                            props.user.humanChips,
                            props.user.computerChips + props.user.pot
                        );
                    }}
                >
                    Fold
                </button>
                {showCheck && (
                    <button
                        onClick={() => {
                            playCheck();
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "check",
                                props.user.pot,
                                0,
                                props.user.gameState,
                                props.user.computerBet
                            );
                        }}
                    >
                        Check
                    </button>
                )}

                {showBet && (
                    <button
                        onClick={() => {
                            console.log(betAmount);
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                betAmount,
                                props.user.pot
                            );
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "bet",
                                props.user.pot,
                                Number(raiseAmount),
                                props.user.gameState,
                                props.user.computerBet
                            );
                        }}
                    >
                        <span>Bet</span>
                        <span>{raiseAmount}</span>
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
                                props.user.pot,
                                Number(callAmount),
                                props.user.gameState,
                                props.user.computerBet
                            );
                        }}
                    >
                        <>
                            {callAmount != props.user.humanChips ? (
                                <span>Call</span>
                            ) : (
                                <span>All In</span>
                            )}
                            {callAmount > props.user.humanChips
                                ? props.user.humanChips
                                : callAmount}
                        </>
                    </button>
                )}
                {showRaise && callAmount != props.user.humanChips && (
                    <button
                        onClick={() => {
                            props.updateHumanChips(
                                props.user.humanChips,
                                "lose",
                                Number(raiseAmount)
                            );
                            props.updateGameplay(
                                "human",
                                props.user.smallBlind,
                                "raise",
                                props.user.pot,
                                Number(raiseAmount),
                                props.user.gameState,
                                props.user.computerBet
                            );
                        }}
                    >
                        <span>Raise</span>
                        <span>{Number(raiseAmount)}</span>
                    </button>
                )}
            </div>
            <div class="slidecontainer">
                <input
                    type="range"
                    //TODO: add min when facing AI bet to min value of bet
                    min={props.user.gameState == "preflop" ? "150" : "100"}
                    max={props.user.humanChips}
                    value={raiseAmount}
                    class="slider"
                    id="myRange"
                    onChange={(e) =>
                        handleSlider(Math.ceil(e.target.value / 10) * 10)
                    }
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
