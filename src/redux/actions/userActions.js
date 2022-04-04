import {
    UPDATE_HUMAN_CHIPS,
    UPDATE_COMPUTER_CHIPS,
    SET_HANDS,
    SET_REMAINING_DECK,
    SET_FLOP,
    UPDATE_GAMEPLAY,
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

export const newHand = () => (dispatch) => {
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
    console.log(card3, card4);
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

export const updateDeck = (deckMinusFlop, holeCards) => (dispatch) => {
    let holeCardsArray = [
        holeCards.card1.card,
        holeCards.card2.card,
        holeCards.card3.card,
        holeCards.card4.card,
    ];
    let res = deckMinusFlop.filter(
        (card) => !holeCardsArray.includes(card.card)
    );
    // remove holecards and community cards from deck
    // dispatch({
    //     type: SET_REMAINING_DECK,
    //     payload: { updatedDeck: deckMinusFlopAndHoleCards, trip: 1 },
    // });
};
export const setFlop = (cards) => (dispatch) => {
    dispatch({ type: SET_FLOP, payload: cards });
};

export const updateGameplay =
    (player, action, prevAction, currentPot, chips) => (dispatch) => {
        let updatedPot = (currentPot += chips);
        // AI gameplay
        if (player == "computer") {
        } else {
            // Human gameplay
            dispatch({
                type: UPDATE_GAMEPLAY,
                payload: { action, updatedPot },
            });
        }
    };
