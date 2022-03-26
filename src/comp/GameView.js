import React, { useEffect } from "react";
import Avatar from "./Avatar";
import HoleCards from "./HoleCards";
import { cards } from "../Model/cards";
import { useState } from "react";
import BigBlind from "./BigBlind";
import DealerBtn from "./DealerBtn";
import BettingUI from "./BettingUI";
import { connect } from "react-redux";
import { newHand } from "../redux/actions/userActions";
function GameView(props) {
    const [computerHand, setComputerHand] = useState({ card1: "", card2: "" });
    const [userHand, setUserHand] = useState({ card1: "", card2: "" });
    const [bigBlind, setBigBlind] = useState("computer");
    const [smallBlind, setSmallBlind] = useState("human");

    useEffect(() => {
        props.newHand();
        // preflop();
    }, []);

    // const preflop = () => {};
    return (
        <>
            <div class="poker-table">
                <Avatar
                    player="computer"
                    id={"avatar-1"}
                    chips={props.user.computerChips}
                />
                <HoleCards isHuman={false} id={"avatar-1"} />
                <Avatar
                    player={"human"}
                    id={"avatar-2"}
                    chips={props.user.humanChips}
                />
                <HoleCards isHuman={true} id={"avatar-2"} />
                <BigBlind player={bigBlind} />
                <DealerBtn player={smallBlind} />
            </div>
            <BettingUI chips={props.user.humanChips} />
            <button onClick={() => newHand()}>New hand</button>
        </>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};

const mapActionsToProps = {
    newHand,
};
export default connect(mapStateToProps, mapActionsToProps)(GameView);