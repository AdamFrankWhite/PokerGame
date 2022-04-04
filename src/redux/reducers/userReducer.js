import {
    UPDATE_HUMAN_CHIPS,
    UPDATE_COMPUTER_CHIPS,
    SET_HANDS,
    SET_REMAINING_DECK,
    SET_FLOP,
    UPDATE_GAMEPLAY,
} from "../types";

import { cards } from "../../Model/cards";

const initialState = {
    humanChips: 3000,
    computerChips: 3000,
    hands: {},
    bigBlind: "computer",
    gameState: "preflop",
    startDeck: cards,
    remainingDeck: [],
    communityCards: {},
    trip: 0,
    pot: 0,
    prevAction: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_COMPUTER_CHIPS:
            return {
                ...state,
                computerChips: action.payload,
            };
        case UPDATE_HUMAN_CHIPS:
            return {
                ...state,
                humanChips: action.payload,
            };
        case SET_HANDS:
            return {
                ...state,
                hands: {
                    computerHand: action.payload.computer,
                    humanHand: action.payload.human,
                },
                prevAction: "",
            };
        case SET_REMAINING_DECK:
            return {
                ...state,
                remainingDeck: action.payload.updatedDeck,
                trip: action.payload.trip,
            };
        case SET_FLOP:
            return {
                ...state,
                communityCards: action.payload,
            };
        case UPDATE_GAMEPLAY:
            return {
                ...state,
                prevAction: action.payload.action,
                pot: action.payload.updatedPot,
            };
        default:
            return { ...state };
    }
}
