import React, { useEffect } from "react";
import Avatar from "./Avatar";
import HoleCards from "./HoleCards";
import { cards } from "../Model/cards";
import { useState } from "react";
import BigBlind from "./BigBlind";
import DealerBtn from "./DealerBtn";
import BettingUI from "./BettingUI";
export default function GameView(props) {
    const [computerHand, setComputerHand] = useState({ card1: "", card2: "" });
    const [userHand, setUserHand] = useState({ card1: "", card2: "" });
    const [bigBlind, setBigBlind] = useState("computer");
    const [smallBlind, setSmallBlind] = useState("human");
    const [computerChips, updateComputerChips] = useState(3000);
    const [humanChips, updateHumanChips] = useState(3000);
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
        setBigBlind(bigBlind == "computer" ? "human" : "computer");
        setSmallBlind(smallBlind == "computer" ? "human" : "computer");
    };
    useEffect(() => {
        newHand();
        preflop();
    }, []);

    const preflop = () => {};
    return (
        <>
            <div class="poker-table">
                <Avatar
                    player="computer"
                    id={"avatar-1"}
                    chips={computerChips}
                />
                <HoleCards
                    isHuman={false}
                    id={"avatar-1"}
                    hand={computerHand}
                />
                <Avatar
                    player={props.user}
                    id={"avatar-2"}
                    chips={humanChips}
                />
                <HoleCards isHuman={true} id={"avatar-2"} hand={userHand} />
                <BigBlind player={bigBlind} />
                <DealerBtn player={smallBlind} />
            </div>
            <BettingUI chips={humanChips} />
            <button onClick={() => newHand()}>New hand</button>
        </>
    );
}
