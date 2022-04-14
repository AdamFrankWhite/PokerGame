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

export const newHand = (prevSB) => (dispatch) => {
    if (prevSB == "computer") {
        dispatch({
            type: SET_SMALLBLIND,
            payload: {
                smallBlind: "human",
                humanChips: 50,
                computerChips: 100,
            },
        });
    } else {
        dispatch({
            type: SET_SMALLBLIND,
            payload: {
                smallBlind: "computer",
                humanChips: 100,
                computerChips: 50,
            },
        });
    }

    // clear community cards

    dispatch({
        type: CHANGE_GAMESTATE,
        payload: "preflop",
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

export const updateGameplay =
    (player, action, prevAction, currentPot, chips, gameState) =>
    (dispatch) => {
        // let gameState = ["preflop", "flop", "turn", "river", "showdown"];
        let updatedPot = (currentPot += chips);
        const AI_MOVE = (prevAction, currentPot, humanBet) => {
            let updatedPot = currentPot + humanBet; // match human bet
            // console.log("ai thinking");
            if (prevAction == "bet") {
                // AI autocall
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "call",
                            updatedPot,
                            setThinkingTimer: false,
                        },
                    });
                }, 2000);
            }

            if (prevAction == "check") {
                // AI autocheck
                setTimeout(() => {
                    dispatch({
                        type: UPDATE_GAMEPLAY,
                        payload: {
                            action: "check",
                            updatedPot,
                            setThinkingTimer: false,
                        },
                    });
                }, 2000);
            }
            if (gameState == "flop") {
                if (action == "call" || action == "check") {
                    dispatch({ type: CHANGE_GAMESTATE, payload: "turn" });
                }
            }
            if (
                gameState == "turn" &&
                (action == "call" || action == "check")
            ) {
                dispatch({ type: CHANGE_GAMESTATE, payload: "river" });
            }

            if (
                gameState == "river" &&
                (action == "call" || action == "check")
            ) {
                dispatch({ type: CHANGE_GAMESTATE, payload: "showdown" });
            }
        };
        // AI gameplay
        if (player == "computer") {
        } else {
            // Human gameplay
            // console.log(action);
            if (gameState == "preflop" && action == "call") {
                dispatch({ type: CHANGE_GAMESTATE, payload: "flop" });
            }
            dispatch({
                type: UPDATE_GAMEPLAY,
                payload: { action, updatedPot, setThinkingTimer: true },
            });

            AI_MOVE(action, currentPot, chips);
        }
    };

export const setStraightFlush = () => (dispatch) => {
    dispatch({ type: SET_STRAIGHT_FLUSH, payload: "" });
};
