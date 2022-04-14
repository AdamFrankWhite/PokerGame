import {
    UPDATE_HUMAN_CHIPS,
    UPDATE_COMPUTER_CHIPS,
    SET_HANDS,
    SET_REMAINING_DECK,
    SET_FLOP,
    SET_TURN,
    SET_RIVER,
    UPDATE_GAMEPLAY,
    SET_SMALLBLIND,
    CHANGE_GAMESTATE,
    SET_STRAIGHT_FLUSH,
    SET_HAND_WINNER,
    EMPTY_POT,
} from "../types";

import { cards } from "../../Model/cards";

const initialState = {
    humanChips: 3000,
    computerChips: 3000,
    hands: {},
    smallBlind: "computer",
    gameState: "preflop",
    startDeck: cards,
    remainingDeck: [],
    communityCards: {},
    trip: 0,
    pot: 0,
    prevAction: "",
    thinkingTimer: false,
    playerTurn: "human",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_SMALLBLIND:
            return {
                ...state,
                smallBlind: action.payload.smallBlind,
                pot: action.payload.humanChips + action.payload.computerChips,
                humanChips: state.humanChips - action.payload.humanChips,
                computerChips:
                    state.computerChips - action.payload.computerChips,
            };
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
        case CHANGE_GAMESTATE:
            return {
                ...state,
                gameState: action.payload,
            };
        case SET_FLOP:
            return {
                ...state,
                communityCards: action.payload,
            };
        case SET_TURN:
            return {
                ...state,
                communityCards: { ...state.communityCards, ...action.payload },
            };
        case SET_RIVER:
            return {
                ...state,
                communityCards: { ...state.communityCards, ...action.payload },
            };
        case UPDATE_GAMEPLAY:
            return {
                ...state,
                prevAction: action.payload.action,
                pot: action.payload.updatedPot,
                thinkingTimer: true,
            };
        case SET_STRAIGHT_FLUSH:
            return {
                ...state,
                communityCards: [
                    {
                        card: "TH",
                        path: `../img/cards/TH.svg`,
                        suit: "Hearts",
                        value: 10,
                    },

                    {
                        card: "JH",
                        path: `../img/cards/JH.svg`,
                        suit: "Hearts",
                        value: 11,
                    },

                    {
                        card: "QH",
                        path: `../img/cards/QH.svg`,
                        suit: "Hearts",
                        value: 12,
                    },

                    {
                        card: "KH",
                        path: `../img/cards/KH.svg`,
                        suit: "Hearts",
                        value: 13,
                    },
                    {
                        card: "9H",
                        path: `../img/cards/9H.svg`,
                        suit: "Hearts",
                        value: 9,
                    },
                ],
            };
        case EMPTY_POT: {
            return {
                ...state,
                pot: 0,
            };
        }
        default:
            return { ...state };
    }
}
