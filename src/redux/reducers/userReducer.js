import { UPDATE_HUMAN_CHIPS, UPDATE_COMPUTER_CHIPS, SET_HANDS } from "../types";

const initialState = {
    humanChips: 3000,
    computerChips: 3000,
    humanHand: {},
    computerHand: {},
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
                computerHand: action.payload.computer,
                humanHand: action.payload.human,
            };

        default:
            return { ...state };
    }
}
