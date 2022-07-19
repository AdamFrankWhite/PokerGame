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
    RETURN_UNMATCHED_CHIPS,
    SET_HAND_WINNER,
    EMPTY_POT,
    NEW_HAND,
    SET_SHOWDOWN_DESCRIPTION,
    SET_PLAYER,
    SET_DIFFICULTY,
    SET_ALL_IN,
    SET_GAME_WINNER,
    NEW_GAME,
} from "../types";

import { cards } from "../../Model/cards";
import { bindActionCreators } from "redux";

const initialState = {
    humanChips: 3000,
    computerChips: 3000,
    hands: {},
    smallBlind: "human",
    gameState: "preflop",
    startDeck: cards,
    remainingDeck: [],
    communityCards: {},
    trip: 0,
    pot: 0,
    prevAction: "",
    thinkingTimer: false,
    playerTurn: "",
    showdownDescription: "",
    computerBet: 50,
    difficulty: "easy",
    allIn: false,
    gameWinner: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case NEW_GAME:
            return {
                ...initialState,
            };
        case NEW_HAND:
            return {
                ...state,
                gameState: "preflop",
                pot: 0,
                [`${action.payload.winner}Chips`]:
                    state[`${action.payload.winner}Chips`] + action.payload.pot,
                prevAction: "",
                computerBet: 0,
                allIn: false,
                // playerTurn: "",
            };
        case SET_DIFFICULTY:
            return {
                ...state,
                difficulty: action.payload,
            };
        case SET_PLAYER:
            return {
                ...state,
                playerTurn: action.payload,
            };
        case SET_SMALLBLIND:
            return {
                ...state,
                smallBlind: action.payload.smallBlind,
                pot: 150,
                humanChips: action.payload.humanChips,
                computerChips: action.payload.computerChips,
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
                prevAction: "", // fix skipping gameState bug
                playerTurn: "",
            };
        case SET_ALL_IN:
            return {
                ...state,
                allIn: true,
            };
        case SET_FLOP:
            return {
                ...state,
                communityCards: action.payload,
                playerTurn: "",
            };
        case SET_TURN:
            return {
                ...state,
                communityCards: { ...state.communityCards, ...action.payload },
                playerTurn: "",
            };
        case SET_RIVER:
            return {
                ...state,
                communityCards: { ...state.communityCards, ...action.payload },
                prevAction: "",
                playerTurn: "",
            };
        case UPDATE_GAMEPLAY:
            return {
                ...state,
                prevAction: action.payload.action,
                pot: action.payload.updatedPot,
                computerBet: action.payload.computerBet
                    ? action.payload.computerBet
                    : 0,
                // thinkingTimer: true,
            };
        case RETURN_UNMATCHED_CHIPS:
            return {
                ...state,
                [`${action.payload.recipient}Chips`]:
                    action.payload.returnedChips,
            };
        case SET_GAME_WINNER:
            return {
                ...state,
                gameWinner: action.payload,
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
        case SET_SHOWDOWN_DESCRIPTION: {
            return {
                ...state,
                showdownDescription: action.payload,
                playerTurn: "",
            };
        }
        default:
            return { ...state };
    }
}
