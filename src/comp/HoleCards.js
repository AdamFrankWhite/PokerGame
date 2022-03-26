import React from "react";

export default function HoleCards(props) {
    function importAll(r) {
        let images = {};
        r.keys().map((item) => {
            images[item.replace("./", "")] = r(item);
        });
        return images;
    }

    const images = importAll(require.context("../img/cards", false, /.svg/));
    console.log(props.hand);
    return (
        <div className={"holecards " + props.id}>
            {props.isHuman ? (
                <>
                    <img
                        src={
                            props.hand.card1.card &&
                            images[`${props.hand.card1.card.toUpperCase()}.svg`]
                        }
                    />
                    <img
                        src={
                            props.hand.card2.card &&
                            images[`${props.hand.card2.card.toUpperCase()}.svg`]
                        }
                    />
                </>
            ) : (
                <>
                    <img src={images["1B.svg"]} />
                    <img src={images["1B.svg"]} />
                </>
            )}
        </div>
    );
}
