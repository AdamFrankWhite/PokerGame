import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { updateDeck } from "../redux/actions/userActions";
function CommunityCards(props) {
    function importAll(r) {
        let images = {};
        r.keys().map((item) => {
            images[item.replace("./", "")] = r(item);
        });
        return images;
    }
    const images = importAll(require.context("../img/cards", false, /.svg/));
    const [cardImages, setCardImages] = useState({
        card1: images["1B.svg"],
        card2: images["1B.svg"],
        card3: images["1B.svg"],
    });
    const getRandomCard = (currentDeckSize) => {
        return Math.floor(Math.random() * currentDeckSize);
    };
    const [trip, setTrip] = useState(0);
    useEffect(() => {
        if (props.user.remainingDeck.length > 0 && trip === 0) {
            console.log(trip);
            let remainingDeck = props.user.remainingDeck;
            let card1 = remainingDeck[getRandomCard(remainingDeck.length)];
            remainingDeck = remainingDeck.filter(
                (item) => item.card != card1.card
            );
            let card2 = remainingDeck[getRandomCard(remainingDeck.length)];
            remainingDeck = remainingDeck.filter(
                (item) => item.card != card2.card
            );
            // setComputerHand({ card1, card2 });

            let card3 = remainingDeck[getRandomCard(remainingDeck.length)];
            remainingDeck = remainingDeck.filter(
                (item) => item.card != card3.card
            );
            setCardImages({ card1, card2, card3 });
            console.log(cardImages);
            props.updateDeck(remainingDeck);
            setTrip(1);
        }
    }, [props.user.remainingDeck]);
    return (
        <div className="community-cards">
            {Object.keys(cardImages).map((key) => {
                console.log(cardImages[key]);
                // console.log(`${cardImages[key].card}.svg`);
                return <img src={images[`${cardImages[key].card}.svg`]} />;
            })}
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};
const mapActionsToProps = { updateDeck };
export default connect(mapStateToProps, mapActionsToProps)(CommunityCards);
