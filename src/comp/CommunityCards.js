import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
    newHand,
    updateDeck,
    setFlop,
    setTurn,
    setRiver,
} from "../redux/actions/userActions";
function CommunityCards(props) {
    function importAll(r) {
        let images = {};
        r.keys().map((item) => {
            images[item.replace("./", "")] = r(item);
        });
        return images;
    }
    const images = importAll(require.context("../img/cards", false, /.svg/));
    const [communityCardImages, setCommunityCardImages] = useState(
        props.user.communityCards
    );
    const getRandomCard = (currentDeckSize) => {
        return Math.floor(Math.random() * currentDeckSize);
    };
    const dealFlop = () => {
        let deckMinusFlopCards = props.user.remainingDeck;
        let card1 =
            deckMinusFlopCards[getRandomCard(deckMinusFlopCards.length)];
        deckMinusFlopCards = deckMinusFlopCards.filter(
            (item) => item.card != card1.card
        );
        let card2 =
            deckMinusFlopCards[getRandomCard(deckMinusFlopCards.length)];
        deckMinusFlopCards = deckMinusFlopCards.filter(
            (item) => item.card != card2.card
        );
        // setComputerHand({ card1, card2 });

        let card3 =
            deckMinusFlopCards[getRandomCard(deckMinusFlopCards.length)];
        deckMinusFlopCards = deckMinusFlopCards.filter(
            (item) => item.card != card3.card
        );
        props.setFlop({ card1, card2, card3 });
        // console.log(cardImages);

        let deckMinusFlopAndHoleCards = deckMinusFlopCards.filter(
            (item) =>
                item.card != props.user.hands.computerHand.card1 &&
                item.card != props.user.hands.computerHand.card2 &&
                item.card != props.user.hands.computerHand.card3 &&
                item.card != props.user.hands.computerHand.card4
        );
        props.updateDeck(deckMinusFlopAndHoleCards);
    };

    const dealTurn = () => {
        let deckMinusCommunityCards = props.user.remainingDeck;
        let card4 =
            deckMinusCommunityCards[
                getRandomCard(deckMinusCommunityCards.length)
            ];
        deckMinusCommunityCards = deckMinusCommunityCards.filter(
            (item) => item.card != card4.card
        );

        props.setTurn({ card4 });
        // console.log(cardImages);
        props.updateDeck(deckMinusCommunityCards);
    };

    const dealRiver = () => {
        let deckMinusCommunityCards = props.user.remainingDeck;
        let card5 =
            deckMinusCommunityCards[
                getRandomCard(deckMinusCommunityCards.length)
            ];
        deckMinusCommunityCards = deckMinusCommunityCards.filter(
            (item) => item.card != card5.card
        );
        // console.log(card5);
        props.setRiver({ card5 });
        props.updateDeck(deckMinusCommunityCards);
    };
    //monitor changes to deck, if a new hand, trip will be 0, so hand can be dealt, to avoid endless looping when setting flop/turn/river cards, trip is set on new hand, and reset only when new hand is dealt
    useEffect(() => {
        if (
            props.user.remainingDeck.length > 0 &&
            props.user.gameState === "flop"
        ) {
            dealFlop();
        }
        if (props.user.gameState === "turn") {
            dealTurn();
        }
        if (props.user.gameState === "river") {
            dealRiver();
        }
    }, [props.user.gameState]);

    const compareHands = (computerHand, humanHand, communityCards) => {
        let computerCardSet = { ...computerHand, ...communityCards };
        let humanCardSet = { ...humanHand, ...communityCards };
        console.log(computerCardSet, humanCardSet);

        const checkHandStrength = (cardSet) => {
            let cards = Object.keys(cardSet).map((key) => cardSet[key]); //Check royal flush
            let handType = [];

            // sort card objects
            const sortCards = cards.sort((a, b) =>
                a.value > b.value ? 1 : -1
            );
            console.log(sortCards);
            // get card values
            const getCardValues = sortCards.map((card) => card.value);

            // check x of a kind
            const cardCounts = {
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
            };

            getCardValues.forEach(
                (cardValue) =>
                    (cardCounts[cardValue] = cardCounts[cardValue] + 1)
            );
            let cardCountsArr = Object.keys(cardCounts).map((key) => {
                return {
                    cardValue: key,
                    count: cardCounts[key],
                };
            });
            // console.log(cardCountsArr);
            let sort1 = cardCountsArr.sort((a, b) =>
                a.count > b.count ? 1 : -1
            );
            let sort2 = sort1.sort((a, b) =>
                a.count == b.count
                    ? Number(a.cardValue) > Number(b.cardValue)
                        ? 1
                        : -1
                    : 0
            );
            console.log(sort2);
            // Get highest pair
            let xOfAKind = sort2[12];

            // Swap in card picture values
            if (xOfAKind.cardValue == 11) {
                xOfAKind.cardValue = "J";
            }
            if (xOfAKind.cardValue == 12) {
                xOfAKind.cardValue = "Q";
            }
            if (xOfAKind.cardValue == 13) {
                xOfAKind.cardValue = "K";
            }
            if (xOfAKind.cardValue == 14) {
                xOfAKind.cardValue = "A";
            }
            if (xOfAKind.count == 4) {
                handType = [
                    `4 of a kind ${xOfAKind.cardValue}s`,
                    xOfAKind.cardValue,
                ];
            }
            if (xOfAKind.count == 3) {
                //CHECK FULLHOUSE
                if (sort2[11].count == 2) {
                    handType = [
                        `Full House ${xOfAKind.cardValue}s over ${sort2[11].cardValue}s`,
                        xOfAKind.cardValue,
                    ];
                } else {
                    handType = [
                        `3 of a kind ${xOfAKind.cardValue}s`,
                        xOfAKind.cardValue,
                    ];
                }
            }
            if (xOfAKind.count == 2) {
                //CHECK 2 Pair
                if (sort2[11].count == 2) {
                    handType = [
                        `2 Pairs ${xOfAKind.cardValue}s and ${sort2[11].cardValue}s`,
                        `${sort2[10].cardValue} kicker`,
                    ];
                } else {
                    handType = [
                        `Pair of ${xOfAKind.cardValue}s`,
                        `${sort2[11].cardValue} kicker`,
                    ];
                }
            }
            console.log(handType);
            // check straight
            const straightTypes = [
                // A, 2, 3, 4, 5
                [14, 2, 3, 4, 5],
                [2, 3, 4, 5, 6],
                [3, 4, 5, 6, 7],
                [4, 5, 6, 7, 8],
                [5, 6, 7, 8, 9],
                [6, 7, 8, 9, 10],
                [7, 8, 9, 10, 11],
                [8, 9, 10, 11, 12],
                [9, 10, 11, 12, 13],
                // T, J, Q, K, A
                [10, 11, 12, 13, 14],
            ];
            let straight;
            straightTypes.forEach((straightType) => {
                const check = straightType.every((straightType) =>
                    getCardValues.includes(straightType)
                );

                if (check) {
                    //Check for highest straight
                    if (straight) {
                        if (straightType[4] > straight[4]) {
                            handType = ["Straight", straightType];
                            // console.log(handType);
                        }
                    } else {
                        handType = ["Straight", straightType];
                        // console.log(handType);
                    }
                }
            });

            //check flush
            const checkClubs = cards.filter((card) => card.suit == "Clubs");
            const checkSpades = cards.filter((card) => card.suit == "Spades");
            const checkHearts = cards.filter((card) => card.suit == "Hearts");
            const checkDiamonds = cards.filter(
                (card) => card.suit == "Diamonds"
            );
            const flushCheckSuits = [
                checkClubs,
                checkDiamonds,
                checkHearts,
                checkSpades,
            ];
            // check for 5+ of same suit
            let flushCheck = flushCheckSuits.filter((suit) => suit.length >= 5);
            //if flush exists, update handType
            if (flushCheck.length > 0) {
                handType = [
                    "Flush",
                    flushCheck[0].sort((a, b) => (a.value > b.value ? -1 : 1)),
                    flushCheck[0][0].suit,
                ];
            }
        };
        checkHandStrength(computerCardSet);
        checkHandStrength(humanCardSet);
    };
    const [showHandWinner, toggleShowdown] = useState(false);
    useEffect(() => {
        if (props.user.gameState == "showdown") {
            const humanHand = {
                card6: props.user.hands.humanHand.card1,
                card7: props.user.hands.humanHand.card2,
            };
            const computerHand = {
                card6: props.user.hands.computerHand.card1,
                card7: props.user.hands.computerHand.card2,
            };

            compareHands(computerHand, humanHand, props.user.communityCards);
            toggleShowdown(true);
        } else {
            toggleShowdown(false);
        }
    }, [props.user.gameState]);
    useEffect(() => {
        setCommunityCardImages(props.user.communityCards);
    }, [props.user.communityCards]);
    return (
        <div className="community-cards">
            {/* Only show community cards post-flop */}
            {props.user.gameState !== "preflop" &&
                Object.keys(communityCardImages).map((key) => {
                    // console.log(`${cardImages[key].card}.svg`);
                    return (
                        <img
                            src={images[`${communityCardImages[key].card}.svg`]}
                        />
                    );
                })}
            {showHandWinner && <span>Showdown</span>}
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};
const mapActionsToProps = { updateDeck, setFlop, setTurn, setRiver };
export default connect(mapStateToProps, mapActionsToProps)(CommunityCards);
