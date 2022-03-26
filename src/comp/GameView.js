import React, { useEffect } from "react";
import Avatar from "./Avatar";
import HoleCards from "./HoleCards";
import { cards } from "../Model/cards";
import { useState } from "react";
export default function GameView(props) {
    const [computerHand, setComputerHand] = useState({ card1: "", card2: "" });
    const [userHand, setUserHand] = useState({ card1: "", card2: "" });

    const getRandomCard = (currentDeckSize) => {
        return Math.floor(Math.random() * currentDeckSize);
    };
    const newHand = () => {
        // let currentDeck = cards.map((item) => item);
        let updatedDeck = [...cards];
        let card1 = updatedDeck[getRandomCard(updatedDeck.length)];
        updatedDeck = updatedDeck.filter((item) => item.card != card1.card);
        let card2 = updatedDeck[getRandomCard(updatedDeck.length)];
        updatedDeck = updatedDeck.filter((item) => item.card != card2.card);
        setComputerHand({ card1, card2 });

        let card3 = updatedDeck[getRandomCard(updatedDeck.length)];
        updatedDeck = updatedDeck.filter((item) => item.card != card3.card);
        let card4 = updatedDeck[getRandomCard(updatedDeck.length)];
        updatedDeck = updatedDeck.filter((item) => item.card != card4.card);
        setUserHand({ card1: card3, card2: card4 });
        console.log(updatedDeck);
    };
    useEffect(() => {
        newHand();
    }, []);
    return (
        <>
            <div class="poker-table">
                <Avatar player="computer" id={"avatar-1"} />
                <HoleCards
                    isHuman={false}
                    id={"avatar-1"}
                    hand={computerHand}
                />
                <Avatar player={props.user} id={"avatar-2"} />
                <HoleCards isHuman={true} id={"avatar-2"} hand={userHand} />
            </div>
            <button onClick={() => newHand()}>New hand</button>
        </>
    );
}
