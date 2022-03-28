import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
function HoleCards(props) {
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
    });
    useEffect(() => {
        // console.log(props.user.humanHand);

        //Check if state is loaded before updating img src - huge pain to fix
        // if (props.user.hands.humanHand.card1 != images["1B.svg"]) {
        if (Object.keys(props.user.hands).length > 0) {
            setCardImages({
                card1: images[`${props.user.hands.humanHand.card1.card}.svg`],
                card2: images[`${props.user.hands.humanHand.card2.card}.svg`],
            });
        }
    }, [props.user.hands]);

    return (
        <div className={"holecards " + props.id}>
            {props.isHuman ? (
                <>
                    <img src={cardImages.card1} />
                    <img src={cardImages.card2} />
                </>
            ) : (
                <div className="computer-hole-cards">
                    <img src={images["1B.svg"]} />
                    <img src={images["1B.svg"]} />
                </div>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(HoleCards);
