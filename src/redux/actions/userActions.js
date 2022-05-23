import {
    UPDATE_HUMAN_CHIPS,
    UPDATE_COMPUTER_CHIPS,
    SET_HANDS,
    SET_REMAINING_DECK,
    SET_FLOP,
    SET_TURN,
    SET_RIVER,
    SET_SMALLBLIND,
    UPDATE_GAMEPLAY,
    CHANGE_GAMESTATE,
    SET_STRAIGHT_FLUSH,
    SET_PLAYER,
    EMPTY_POT,
    NEW_HAND,
    SET_SHOWDOWN_DESCRIPTION,
} from "../types";
import { cards } from "../../Model/cards";
export const updateHumanChips =
    (currentChips, changeType, amount) => (dispatch) => {
        let updatedChips;
        changeType == "win"
            ? (updatedChips = currentChips + amount)
            : (updatedChips = currentChips - amount);
        dispatch({ type: UPDATE_HUMAN_CHIPS, payload: updatedChips });
    };
export const updateComputerChips =
    (currentChips, changeType, amount) => (dispatch) => {
        let updatedChips =
            changeType == "win" ? currentChips + amount : currentChips - amount;
        dispatch({ type: UPDATE_COMPUTER_CHIPS, payload: updatedChips });
    };

export const newHand = (prevSB, pot, winner) => (dispatch) => {
    // clear community cards

    dispatch({
        type: NEW_HAND,
        payload: {
            smallBlind: prevSB == "human" ? "computer" : "human",
            winner,
            pot,
        },
    });
    const getRandomCard = (currentDeckSize) => {
        return Math.floor(Math.random() * currentDeckSize);
    };
    // let currentDeck = cards.map((item) => item);
    let updatedDeck = [...cards];

    let card1 = updatedDeck[getRandomCard(updatedDeck.length)];
    updatedDeck = updatedDeck.filter((item) => item.card != card1.card);
    let card2 = updatedDeck[getRandomCard(updatedDeck.length)];
    updatedDeck = updatedDeck.filter((item) => item.card != card2.card);
    // setComputerHand({ card1, card2 });

    let card3 = updatedDeck[getRandomCard(updatedDeck.length)];
    updatedDeck = updatedDeck.filter((item) => item.card != card3.card);
    let card4 = updatedDeck[getRandomCard(updatedDeck.length)];
    updatedDeck = updatedDeck.filter((item) => item.card != card4.card);
    // setUserHand({ card1: card3, card2: card4 });
    dispatch({ type: SET_REMAINING_DECK, payload: { updatedDeck, trip: 0 } });

    dispatch({
        type: SET_HANDS,
        payload: {
            human: { card1: card3, card2: card4 },
            computer: { card1, card2 },
        },
    });
    if (prevSB == "human") {
        dispatch({
            type: SET_SMALLBLIND,
            payload: {
                smallBlind: "computer",
                humanChips: 100,
                computerChips: 50,
            },
        });
        // dispatch({
        //     type: SET_PLAYER,
        //     payload: "computer",
        // });
    } else {
        dispatch({
            type: SET_SMALLBLIND,
            payload: {
                smallBlind: "human",
                humanChips: 50,
                computerChips: 100,
            },
        });
        // dispatch({
        //     type: SET_PLAYER,
        //     payload: "human",
        // });
    }
    // setBigBlind(bigBlind == "computer" ? "human" : "computer");
    // setSmallBlind(smallBlind == "computer" ? "human" : "computer");
};

export const updateDeck = (updatedDeck, holeCards) => (dispatch) => {
    // let holeCardsArray = [
    //     holeCards.card1.card,
    //     holeCards.card2.card,
    //     holeCards.card3.card,
    //     holeCards.card4.card,
    // ];
    // let res = deckMinusFlop.filter(
    //     (card) => !holeCardsArray.includes(card.card)
    // );
    // remove holecards and community cards from deck
    dispatch({
        type: SET_REMAINING_DECK,
        payload: { updatedDeck: updatedDeck, trip: 1 },
    });
};
export const setFlop = (cards) => (dispatch) => {
    dispatch({ type: SET_FLOP, payload: cards });
};

export const setTurn = (card) => (dispatch) => {
    dispatch({ type: SET_TURN, payload: card });
};

export const setRiver = (card) => (dispatch) => {
    dispatch({ type: SET_RIVER, payload: card });
};
let checkIfBothPlayersBeen = false;
export const updateGameState =
    (smallBlind, currentPlayer, action, gameState) => (dispatch) => {
        console.log(gameState);
        if (gameState == "preflop") {
            if (smallBlind == currentPlayer) {
                checkIfBothPlayersBeen = true;
            }
        }
        if (gameState != "preflop" && smallBlind != currentPlayer) {
            checkIfBothPlayersBeen = true;
        }

        if (checkIfBothPlayersBeen) {
            if (gameState == "preflop") {
                if (action == "call" || action == "check") {
                    //reset check
                    checkIfBothPlayersBeen = false;
                    dispatch({ type: CHANGE_GAMESTATE, payload: "flop" });
                }
            }
            if (gameState == "flop") {
                if (action == "call" || action == "check") {
                    //reset check
                    checkIfBothPlayersBeen = false;
                    dispatch({ type: CHANGE_GAMESTATE, payload: "turn" });
                }
            }
            if (
                gameState == "turn" &&
                (action == "call" || action == "check")
            ) {
                //reset check
                checkIfBothPlayersBeen = false;
                dispatch({ type: CHANGE_GAMESTATE, payload: "river" });
            }

            if (
                gameState == "river" &&
                (action == "call" || action == "check")
            ) {
                //reset check
                checkIfBothPlayersBeen = false;
                dispatch({ type: CHANGE_GAMESTATE, payload: "showdown" });
            }
        }
    };

export const setPlayer = (player) => (dispatch) => {
    dispatch({ type: SET_PLAYER, payload: player });
};
export const updateGameplay =
    (player, smallBlind, action, prevAction, currentPot, chips, gameState) =>
    (dispatch) => {
        if (gameState != "showdown") {
            if (player == "human") {
                dispatch({ type: SET_PLAYER, payload: "computer" });
            } else if (player == "computer") {
                dispatch({ type: SET_PLAYER, payload: "human" });
            }
        }
        // else {
        //     dispatch({ type: SET_PLAYER, payload: "" });
        // }

        dispatch({
            type: UPDATE_GAMEPLAY,
            payload: {
                action,
                updatedPot: currentPot + chips,
                setThinkingTimer: false,
            },
        });

        // const updateGameState = () => {
        //     if (gameState == "preflop") {
        //         if (action == "call" || action == "check") {
        //             dispatch({ type: CHANGE_GAMESTATE, payload: "flop" });
        //         }
        //     }
        //     if (gameState == "flop") {
        //         if (action == "call" || action == "check") {
        //             dispatch({ type: CHANGE_GAMESTATE, payload: "turn" });
        //         }
        //     }
        //     if (
        //         gameState == "turn" &&
        //         (action == "call" || action == "check")
        //     ) {
        //         dispatch({ type: CHANGE_GAMESTATE, payload: "river" });
        //     }

        //     if (
        //         gameState == "river" &&
        //         (action == "call" || action == "check")
        //     ) {
        //         dispatch({ type: CHANGE_GAMESTATE, payload: "showdown" });
        //     }
        // };
        const AI_MOVE = (prevAction, currentPot, humanBet) => {
            let updatedPot = currentPot + humanBet; // match human bet

            // AI SB preflop
            if (prevAction == "" && gameState == "preflop") {
                // AI autocall
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "check",
                            updatedPot: 200,
                            // setThinkingTimer: false,
                        },
                    });
                    dispatch({ type: SET_PLAYER, payload: "human" });
                    // updateGameState();
                }, 2000);
            }

            if (prevAction == "bet") {
                // AI autocall
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "call",
                            updatedPot,
                            // setThinkingTimer: false,
                        },
                    });
                    dispatch({ type: SET_PLAYER, payload: "human" });
                    // updateGameState();
                }, 2000);
            }

            if (prevAction == "check") {
                // AI autocheck
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "check",
                            updatedPot: currentPot,
                            // setThinkingTimer: false,
                        },
                    });
                    dispatch({ type: SET_PLAYER, payload: "human" });
                    // updateGameState();
                }, 2000);
            }

            if (prevAction == "call") {
                // AI autocheck
                console.log("pc call");
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "check",
                            updatedPot,
                            // setThinkingTimer: false,
                        },
                    });
                    dispatch({ type: SET_PLAYER, payload: "human" });
                    // updateGameState();
                }, 2000);
            }

            // if (player == "human") {
            //     updateGameState();
            // }
        };
        // END OF AI_MOVE

        let updatedPot = (currentPot += chips);

        // PREFLOP
        // if sb == computer, else
        // if fold, new hand
        // if call/check, move to flop

        // FLOP
        // if sb == computer, else
        // if fold, new hand
        // if call/check, move to turn

        // TURN
        // if sb == computer, else
        // if fold, new hand
        // if call/check, move to river

        // SHOWDOWN
        console.log("316", gameState);
        if (gameState != "showdown") {
            AI_MOVE(prevAction, currentPot, chips);
        }
    };

export const setStraightFlush = () => (dispatch) => {
    dispatch({ type: SET_STRAIGHT_FLUSH, payload: "" });
};

export const setHandWinner =
    (winner, currentChips, pot, showdownDescription) => (dispatch) => {
        console.log(showdownDescription);
        let updatedChips = currentChips + pot;
        if (winner == "tie") {
            dispatch({
                type: UPDATE_COMPUTER_CHIPS,
                payload: updatedChips / 2,
            });
            dispatch({ type: UPDATE_HUMAN_CHIPS, payload: updatedChips / 2 });
        }
        if (winner == "computer") {
            dispatch({ type: UPDATE_COMPUTER_CHIPS, payload: updatedChips });
        }
        if (winner == "human") {
            dispatch({ type: UPDATE_HUMAN_CHIPS, payload: updatedChips });
        }
        // dispatch({ type: EMPTY_POT, payload: 0 });
        dispatch({
            type: SET_SHOWDOWN_DESCRIPTION,
            payload: showdownDescription,
        });
        dispatch({
            type: SET_PLAYER,
            payload: "",
        });
    };
