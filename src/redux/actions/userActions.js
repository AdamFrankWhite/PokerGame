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
    RETURN_UNMATCHED_CHIPS,
    EMPTY_POT,
    NEW_HAND,
    SET_ALL_IN,
    SET_SHOWDOWN_DESCRIPTION,
    SET_DIFFICULTY,
    SET_GAME_WINNER,
    UPDATE_POT,
    NEW_GAME,
} from "../types";
import { cards } from "../../Model/cards";
export const setDifficulty = (difficulty) => (dispatch) => {
    dispatch({ type: SET_DIFFICULTY, payload: difficulty });
};

export const updateHumanChips =
    (currentChips, changeType, amount, currentPot) => (dispatch) => {
        let updatedChips;
        if (changeType == "win") {
            updatedChips = currentChips + amount;
        } else {
            if (amount <= currentChips) {
                updatedChips = currentChips - amount;
            } else {
                let returnedChips = amount - currentChips;
                dispatch({
                    type: RETURN_UNMATCHED_CHIPS,
                    payload: { recipient: "computer", returnedChips },
                });
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "all in",
                        updatedPot: currentPot - returnedChips,
                        setThinkingTimer: false,
                    },
                });
            }
        }

        dispatch({ type: UPDATE_HUMAN_CHIPS, payload: updatedChips });
    };
export const updateComputerChips =
    (currentChips, changeType, amount, currentPot) => (dispatch) => {
        let updatedChips;
        if (changeType == "win") {
            updatedChips = currentChips + amount;
        } else {
            if (amount <= currentChips) {
                updatedChips = currentChips - amount;
            } else {
                let returnedChips = amount - currentChips;
                dispatch({
                    type: RETURN_UNMATCHED_CHIPS,
                    payload: { recipient: "human", returnedChips },
                });
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "all in",
                        updatedPot: currentPot - returnedChips,
                        setThinkingTimer: false,
                    },
                });
            }
        }
        dispatch({ type: UPDATE_COMPUTER_CHIPS, payload: updatedChips });
    };

export const newHand = (prevSB, humanChips, computerChips) => (dispatch) => {
    // clear community cards
    if (humanChips == 0 || computerChips == 0) {
        let winner = humanChips == 0 ? "computer" : "player_name";
        dispatch({ type: SET_GAME_WINNER, payload: winner });
    } else {
        dispatch({
            type: NEW_HAND,
            payload: {
                smallBlind: prevSB == "human" ? "computer" : "human",
                // winner,
                // pot,
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
        dispatch({
            type: SET_REMAINING_DECK,
            payload: { updatedDeck, trip: 0 },
        });

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
                    humanChips: humanChips - 100,
                    computerChips: computerChips - 50,
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
                    humanChips: humanChips - 50,
                    computerChips: computerChips - 100,
                },
            });
            // dispatch({
            //     type: SET_PLAYER,
            //     payload: "human",
            // });
        }
        // setBigBlind(bigBlind == "computer" ? "human" : "computer");
        // setSmallBlind(smallBlind == "computer" ? "human" : "computer");
    }
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

export const setAllIn = () => (dispatch) => {
    dispatch({ type: SET_ALL_IN });
};

export const updateGameState =
    (smallBlind, currentPlayer, action, gameState, allIn) => (dispatch) => {
        console.log(gameState, allIn);
        if (allIn) {
            dispatch({ type: CHANGE_GAMESTATE, payload: gameState });
        }
        console.log(action);
        if (gameState == "preflop") {
            if (smallBlind != currentPlayer) {
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
                // check if computer smallBlind, to avoid moving to next gameState before computer responds
                if (
                    action == "call" ||
                    (action == "check" && smallBlind != currentPlayer)
                ) {
                    //reset check
                    checkIfBothPlayersBeen = false;
                    dispatch({ type: CHANGE_GAMESTATE, payload: "turn" });
                }
            }
            if (
                gameState == "turn" &&
                (action == "call" ||
                    (action == "check" && smallBlind != currentPlayer))
            ) {
                //reset check
                checkIfBothPlayersBeen = false;
                dispatch({ type: CHANGE_GAMESTATE, payload: "river" });
            }

            if (
                gameState == "river" &&
                (action == "call" ||
                    (action == "check" && smallBlind != currentPlayer))
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
    (player, smallBlind, action, currentPot, bet, gameState, computerBet) =>
    (dispatch) => {
        console.log(action, smallBlind);
        // Human action
        if (player == "human") {
            dispatch({
                type: UPDATE_GAMEPLAY,
                payload: {
                    action,
                    updatedPot: currentPot + bet,
                    setThinkingTimer: false,
                    computerBet,
                },
            });
            // if (gameState == "preflop" && action == "call") {
            //     dispatch({ type: SET_PLAYER, payload: "computer" });
            // }
            // playerTurn = "computer";
        }

        // END OF AI_MOVE

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

        // if (player == "computer" && gameState != "showdown") {
        //     AI_MOVE(action, currentPot, computerChips, bet);
        // }

        // Set next player's go
        if (
            gameState != "preflop" &&
            smallBlind == "human" &&
            (action == "call" || action == "check")
        ) {
            dispatch({ type: SET_PLAYER, payload: "" });
        } else if (
            smallBlind == "computer" &&
            (action == "call" || action == "check") &&
            gameState == "preflop"
        ) {
            dispatch({ type: SET_PLAYER, payload: "" });
        } else if (gameState != "preflop" && action == "call") {
            dispatch({ type: SET_PLAYER, payload: "" });
        } else if (gameState != "showdown") {
            if (player == "human") {
                dispatch({ type: SET_PLAYER, payload: "computer" });
            }
        } else {
            dispatch({ type: SET_PLAYER, payload: "computer" });
        }
    };

export const AI_MOVE =
    (
        smallBlind,
        prevAction,
        currentPot,
        bet,
        gameState,
        computerChips,
        lastComputerBet,
        humanChips
    ) =>
    (dispatch) => {
        let updatedPot = currentPot + bet; // match human bet
        console.log(lastComputerBet);
        // AI SB preflop
        console.log(prevAction);
        if (prevAction == "" && gameState == "preflop") {
            // AI autocall
            setTimeout(() => {
                // console.log(gameState);
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "check",
                        updatedPot: currentPot + 50,
                        // setThinkingTimer: false,
                    },
                });
                dispatch({
                    type: UPDATE_COMPUTER_CHIPS,
                    payload: computerChips - bet,
                });
                if (smallBlind == "human") {
                    dispatch({ type: SET_PLAYER, payload: "" });
                } else {
                    dispatch({ type: SET_PLAYER, payload: "human" });
                }

                // updateGameState();
                console.log("1");
            }, 2000);
        }

        if (prevAction == "" && gameState != "preflop") {
            // AI autocall
            setTimeout(() => {
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "check",
                        updatedPot: currentPot,
                        // setThinkingTimer: false,
                    },
                });
                if (smallBlind == "human") {
                    dispatch({ type: SET_PLAYER, payload: "human" });
                } else {
                    dispatch({ type: SET_PLAYER, payload: "" });
                }
                // updateGameState();
                console.log("2");
            }, 2000);
        }

        if (prevAction == "bet") {
            let computerMove;

            if (Math.random() * 100 < 30) {
                computerMove = "fold";
            } else {
                computerMove = "call";
            }
            // AI autocall
            if (computerMove == "call") {
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "call",
                            updatedPot: updatedPot,
                            // setThinkingTimer: false,
                        },
                    });
                    dispatch({
                        type: UPDATE_COMPUTER_CHIPS,
                        // updatedPot: updatedPot + bet,
                        payload: computerChips - bet,
                    });
                    dispatch({ type: SET_PLAYER, payload: "" });

                    console.log("3");
                }, 2000);
            } else {
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "fold",
                            updatedPot: currentPot,
                            // setThinkingTimer: false,
                        },
                    });
                    // dispatch({
                    //     type: UPDATE_HUMAN_CHIPS,
                    //     // updatedPot: updatedPot + bet,
                    //     payload: humanChips + updatedPot,
                    // });
                    dispatch({ type: SET_PLAYER, payload: "" });
                }, 2000);
            }
        }
        // Include river conditional to avoid firing unnecessarily at showdown

        if (prevAction == "check" && gameState != "showdown") {
            // AI autocheck
            setTimeout(() => {
                let betAmount = Math.floor(currentPot * 0.8);
                console.log(betAmount, humanChips);
                if (betAmount > humanChips) {
                    betAmount = humanChips;
                }
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "bet",
                        updatedPot:
                            gameState == "preflop"
                                ? currentPot
                                : updatedPot + betAmount,
                        computerBet: betAmount,
                        // setThinkingTimer: false,
                    },
                });
                dispatch({
                    type: UPDATE_COMPUTER_CHIPS,
                    // updatedPot: updatedPot + bet,
                    payload: computerChips - betAmount,
                });
                dispatch({ type: SET_PLAYER, payload: "human" });
                console.log("4");
            }, 2000);
        }

        if (prevAction == "call") {
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
                dispatch({
                    type: UPDATE_COMPUTER_CHIPS,
                    // updatedPot: updatedPot + bet,
                    payload: computerChips,
                });
                dispatch({ type: SET_PLAYER, payload: "" });
                console.log("5", prevAction);
            }, 2000);
        }

        if (prevAction == "raise") {
            // AI autocall
            setTimeout(() => {
                dispatch({
                    type: UPDATE_GAMEPLAY,
                    payload: {
                        action: "call",
                        updatedPot:
                            gameState == "preflop" && smallBlind == "human"
                                ? updatedPot - 50
                                : updatedPot - lastComputerBet,
                        // setThinkingTimer: false,
                    },
                });
                dispatch({
                    type: UPDATE_COMPUTER_CHIPS,
                    // updatedPot: updatedPot + bet,
                    payload:
                        gameState == "preflop"
                            ? computerChips - bet + 50
                            : computerChips + lastComputerBet - bet,
                });
                dispatch({ type: SET_PLAYER, payload: "" });
            }, 2000);
        }
        // dispatch({ type: SET_PLAYER, payload: "human" });
    };
export const setStraightFlush = () => (dispatch) => {
    dispatch({ type: SET_STRAIGHT_FLUSH, payload: "" });
};

export const newGame = (playerName) => (dispatch) => {
    dispatch({ type: NEW_GAME, payload: playerName });
};
export const setHandWinner =
    (winner, currentChips, pot, showdownDescription) => (dispatch) => {
        // console.log(showdownDescription);
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
        dispatch({ type: CHANGE_GAMESTATE, payload: "showdown" });
        dispatch({
            type: SET_SHOWDOWN_DESCRIPTION,
            payload: showdownDescription,
        });
        dispatch({
            type: SET_PLAYER,
            payload: "",
        });
    };
