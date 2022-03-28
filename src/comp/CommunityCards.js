import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { newHand, updateDeck, setFlop } from "../redux/actions/userActions";
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
    const dealHand = () => {
        let deckMinusFlopCards = props.user.startDeck;
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
        props.updateDeck(deckMinusFlopCards, {
            card1: props.user.hands.computerHand.card1,
            card2: props.user.hands.computerHand.card2,
            card3: props.user.hands.humanHand.card1,
            card4: props.user.hands.humanHand.card2,
        });
    };
    //monitor changes to deck, if a new hand, trip will be 0, so hand can be dealt, to avoid endless looping when setting flop/turn/river cards, trip is set on new hand, and reset only when new hand is dealt
    useEffect(() => {
        if (props.user.remainingDeck.length > 0 && props.user.trip === 0) {
            dealHand();
        }
    }, [props.user.remainingDeck]);

    useEffect(() => {
        setCommunityCardImages(props.user.communityCards);
    }, [props.user.communityCards]);
    return (
        <div className="community-cards">
            {Object.keys(communityCardImages).map((key) => {
                // console.log(`${cardImages[key].card}.svg`);
                return (
                    <img src={images[`${communityCardImages[key].card}.svg`]} />
                );
            })}
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};
const mapActionsToProps = { updateDeck, setFlop };
export default connect(mapStateToProps, mapActionsToProps)(CommunityCards);
