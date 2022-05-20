import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
    newHand,
    updateDeck,
    setFlop,
    setTurn,
    setRiver,
    setHandWinner,
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

    const compareHands = (computerCards, humanCards, communityCards) => {
        console.log("comparing...");
        let computerCardSet = { ...computerCards, ...communityCards };
        let humanCardSet = { ...humanCards, ...communityCards };
        // should handType check ascend or descend? ascend would mean unnecessary going through all, even with bad hand, descending would make more sense, algthough straigt flush needs considering
        let computerHand = [];
        let humanHand = [];
        const checkHandStrength = (cardSet, player) => {
            // extract cards into array
            let cards = Object.keys(cardSet).map((key) => cardSet[key]);
            let handType = [];

            // sort card objects
            const sortCards = cards.sort((a, b) =>
                a.value > b.value ? 1 : -1
            );
            // get card values for simpler checks
            const getCardValues = sortCards.map((card) => card.value);

            // check x of a kind
            const cardCounts = {
                2: { count: 0, cardData: {} },
                3: { count: 0, cardData: {} },
                4: { count: 0, cardData: {} },
                5: { count: 0, cardData: {} },
                6: { count: 0, cardData: {} },
                7: { count: 0, cardData: {} },
                8: { count: 0, cardData: {} },
                9: { count: 0, cardData: {} },
                10: { count: 0, cardData: {} },
                11: { count: 0, cardData: {} },
                12: { count: 0, cardData: {} },
                13: { count: 0, cardData: {} },
                14: { count: 0, cardData: {} },
            };

            sortCards.forEach((card) => {
                cardCounts[card.value]["count"] =
                    cardCounts[card.value]["count"] + 1;
                // collect data on duplicate value cards, using same count
                cardCounts[card.value]["cardData"][
                    `card${cardCounts[card.value]["count"]}`
                ] = card;
            });
            let cardCountsArr = Object.keys(cardCounts).map((key) => {
                return {
                    cardValue: key,
                    count: cardCounts[key]["count"],
                    cardData: cardCounts[key]["cardData"],
                };
            });

            let sort1 = cardCountsArr.sort((a, b) =>
                a.count > b.count ? 1 : -1
            );
            // sort non-duplicate cards by cardValue, keeping xOfAKind at end of array
            let sort2 = sort1.sort((a, b) =>
                a.count == b.count
                    ? Number(a.cardValue) > Number(b.cardValue)
                        ? 1
                        : -1
                    : 0
            );
            console.log(sort2);

            let cardData = sort2.map((card) => card.cardData);
            let extractedCardData = [];
            cardData.forEach((card) => {
                // loop through cards data object extracting all the individual cards

                for (const [key, value] of Object.entries(card)) {
                    extractedCardData.push(value);
                }
            });

            let finalHand = extractedCardData.slice(2, 7);

            // console.log(finalHand);
            // Swap in picture card names
            sort2.forEach((card) => {
                if (card.cardValue == "11") {
                    card.cardValue = "J";
                }
                if (card.cardValue == "12") {
                    card.cardValue = "Q";
                }
                if (card.cardValue == "13") {
                    card.cardValue = "K";
                }
                if (card.cardValue == "14") {
                    card.cardValue = "A";
                }
            });
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
                    "Four of a Kind",
                    `4 of a kind ${xOfAKind.cardValue}s`,
                    xOfAKind.cardValue,
                    finalHand,
                ];
            }
            if (xOfAKind.count == 3) {
                //CHECK FULLHOUSE
                if (sort2[11].count == 2) {
                    handType = {
                        handType: "Full House",
                        description: `Full House ${xOfAKind.cardValue}s over ${sort2[11].cardValue}s`,
                        cardValue: xOfAKind.cardValue,
                        finalHand,
                    };
                } else {
                    handType = {
                        handType: "Three of a Kind",
                        description: `3 of a kind ${xOfAKind.cardValue}s`,
                        cardValue: `${sort2[11].cardValue} ${sort2[10].cardValue} kicker`,
                        finalHand,
                    };
                }
            }
            if (xOfAKind.count == 2) {
                //CHECK 2 Pair
                if (sort2[11].count == 2) {
                    handType = {
                        handType: "Two Pairs",
                        description: `2 Pairs ${xOfAKind.cardValue}s and ${sort2[11].cardValue}s`,
                        cardValue: `${sort2[10].cardValue} kicker`,
                        finalHand,
                    };
                } else {
                    handType = {
                        handType: "Pair",
                        description: `Pair of ${xOfAKind.cardValue}s`,
                        cardValue: `${sort2[11].cardValue} kicker`,
                        finalHand,
                    };
                }
            }

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
                    straight = straightType;
                    let straightDuplicate = straight.map((card) => card);
                    // grab card data
                    let handOutput = [];
                    // remove card from straight array, to avoid duplicate cards in finalHand - simpler than checking handOutput by object values
                    straightDuplicate.forEach((cardValue) => {
                        sortCards.forEach((card) => {
                            card.value == cardValue && handOutput.push(card);
                            straightDuplicate.filter(
                                (cardValue) => cardValue !== card.value
                            );
                        });
                    });
                    finalHand = handOutput;
                    //Check for highest straight
                    let textOutput = "";
                    straight.forEach((num) => {
                        textOutput += num + " ";
                    });
                    if (straightType[4] > straight[4]) {
                        handType = {
                            handType: "Straight",
                            description: `Straight ${textOutput}`,
                            cardValue: straight,
                            finalHand,
                        };
                    } else {
                        console.log(straight);
                        handType = {
                            handType: "Straight",
                            description: `Straight ${textOutput}`,
                            cardValue: straight,
                            finalHand,
                        };
                        // return;
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
                finalHand = flushCheck[0].sort((a, b) =>
                    a.value > b.value ? -1 : 1
                );
                finalHand = finalHand.slice(0, 5);
                //TODO CHECK EXTRA FLUSH CARDS, e.g. 3H, AND OTHER STRAIGHT CARDS, e.g. 10S
                // check straight flush

                if (handType.handType == "Straight") {
                    if (
                        JSON.stringify(straight) ==
                        JSON.stringify([10, 11, 12, 13, 14])
                    ) {
                        handType = {
                            handType: "Royal Flush",
                            description: `Royal Flush ${flushCheck[0][0].suit}`,
                            cardValue: flushCheck[0][0].suit,
                            finalHand,
                        };
                    } else {
                        handType = {
                            handType: "Straight Flush",
                            description: `Straight flush ${straight.forEach(
                                (num) => {
                                    return num + " ";
                                }
                            )}`,
                            cardValue: flushCheck[0][0].suit,
                            finalHand,
                        };
                    }
                } else {
                    handType = {
                        handType: "Flush",
                        description: `Flush ${finalHand[0].value} High`,
                        cardValue: flushCheck[0][0].suit,
                        finalHand,
                    };
                }
            }
            console.log(handType);
            // Check high card
            if (handType.length == 0) {
                let highCard = finalHand[4].value;
                let kicker = finalHand[3].value;
                if (kicker == 11) {
                    kicker = "J";
                }
                if (highCard == 11) {
                    highCard = "J";
                }
                if (kicker == 12) {
                    kicker = "Q";
                }
                if (highCard == 12) {
                    highCard = "Q";
                }
                if (kicker == 13) {
                    kicker = "K";
                }
                if (highCard == 13) {
                    highCard = "K";
                }
                if (kicker == 14) {
                    kicker = "A";
                }
                if (highCard == 14) {
                    highCard = "A";
                }

                handType = {
                    handType: "High Card",
                    description: `${highCard} high, ${kicker} kicker`,
                    cardValue: highCard,
                    finalHand,
                };
            }

            if (player == "computer") {
                computerHand = handType;
            } else {
                humanHand = handType;
            }
        };

        const checkHandWinner = (computerHandData, humanHandData) => {
            console.log(computerHandData, humanHandData);
            let computerHandType = computerHandData.handType;
            let humanHandType = humanHandData.handType;
            let computerHand = computerHandData.finalHand;
            let humanHand = humanHandData.finalHand;
            let handTypes = [
                "High Card",
                "Pair",
                "Two Pairs",
                "Three of a Kind",
                "Straight",
                "Flush",
                "Full House",
                "Four of a Kind",
                "Straight Flush",
                "Royal Flush",
            ];
            if (
                handTypes.indexOf(computerHandType) >
                handTypes.indexOf(humanHandType)
            ) {
                let showdownDescription = `Computer wins with ${computerHandData.description}`;
                props.setHandWinner(
                    "computer",
                    props.user.computerChips,
                    props.user.pot,
                    showdownDescription
                );
            } else if (
                handTypes.indexOf(computerHandType) <
                handTypes.indexOf(humanHandType)
            ) {
                let showdownDescription = `Human wins with ${humanHandData.description}`;
                props.setHandWinner(
                    "human",
                    props.user.humanChips,
                    props.user.pot,
                    showdownDescription
                );
            } else if (
                handTypes.indexOf(computerHandType) ==
                handTypes.indexOf(humanHandType)
            ) {
                // check for tie
                // shallow copy then reverse
                let humanHandReverse = humanHand.slice().reverse();
                computerHand
                    .slice()
                    .reverse()
                    .every((card, index) => {
                        if (card.value > humanHandReverse[index].value) {
                            let showdownDescription = `Computer wins with ${computerHandData.description}`;
                            props.setHandWinner(
                                "computer",
                                props.user.computerChips,
                                props.user.pot,
                                showdownDescription
                            );
                            return false;
                        } else if (card.value < humanHandReverse[index].value) {
                            let showdownDescription = `Human wins with ${humanHandData.description}`;
                            props.setHandWinner(
                                "human",
                                props.user.humanChips,
                                props.user.pot,
                                showdownDescription
                            );
                            return false;
                        } else {
                            return true;
                        }
                    });
                //check tie
                let computerHandValues = computerHand.map((card) => card.value);
                let humanHandValues = humanHand.map((card) => card.value);
                if (
                    JSON.stringify(computerHandValues) ==
                    JSON.stringify(humanHandValues)
                ) {
                    let showdownDescription = `Hand tied with ${computerHandType}. Split pot.`;
                    props.setHandWinner(
                        "tie",
                        props.user.humanChips,
                        props.user.pot,
                        showdownDescription
                    );
                }
            }
        };
        checkHandStrength(computerCardSet, "computer");
        checkHandStrength(humanCardSet, "human");
        checkHandWinner(computerHand, humanHand);
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

    // Avoid previous hand community cards flashing on new flop
    useEffect(() => {
        if (props.user.gameState == "preflop") {
            setCommunityCardImages([]);
        }
    }, [props.user.gameState]);
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
            {showHandWinner && (
                <div className="showdown-cont">
                    <p>{props.user.showdownDescription}</p>
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};
const mapActionsToProps = {
    updateDeck,
    setFlop,
    setTurn,
    setRiver,
    setHandWinner,
};
export default connect(mapStateToProps, mapActionsToProps)(CommunityCards);
