import React, { useEffect } from "react";
import Avatar from "./Avatar";
import HoleCards from "./HoleCards";
import { cards } from "../Model/cards";
import { useState } from "react";
import BigBlind from "./BigBlind";
import DealerBtn from "./DealerBtn";
import BettingUI from "./BettingUI";
import CommunityCards from "./CommunityCards";
import ComputerTimer from "./ComputerTimer";
import Pot from "./Pot";
import { connect } from "react-redux";
import {
    newHand,
    setStraightFlush,
    setDifficulty,
} from "../redux/actions/userActions";
function GameView(props) {
    const [computerHand, setComputerHand] = useState({ card1: "", card2: "" });
    const [userHand, setUserHand] = useState({ card1: "", card2: "" });
    const [bigBlind, setBigBlind] = useState("computer");
    const [smallBlind, setSmallBlind] = useState(props.user.smallBlind);

    useEffect(() => {
        props.newHand(
            bigBlind,
            props.user.humanChips,
            props.user.computerChips
        );
        props.setDifficulty(props.difficulty);
        // preflop();
    }, []);

    useEffect(() => {
        // console.log(props.user.smallBlind);
        setSmallBlind(props.user.smallBlind);
    }, [props.user.smallBlind]);
    // const preflop = () => {};
    return (
        <>
            <div class="poker-table">
                <Avatar
                    player="computer"
                    id={"avatar-1"}
                    name={"Computer"}
                    chips={props.user.computerChips}
                />
                <HoleCards isHuman={false} id={"avatar-1"} />
                <ComputerTimer />
                <Pot />
                <CommunityCards />
                <Avatar
                    player={"human"}
                    name={props.name}
                    id={"avatar-2"}
                    chips={props.user.humanChips}
                />
                <HoleCards isHuman={true} id={"avatar-2"} />
                <BigBlind player={bigBlind} />
                <DealerBtn player={smallBlind} />
            </div>
            <BettingUI chips={props.user.humanChips} />
            {/* <button onClick={() => props.setStraightFlush()}>
                Straight flush
            </button> */}
        </>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};

const mapActionsToProps = {
    newHand,
    setStraightFlush,
    setDifficulty,
};
export default connect(mapStateToProps, mapActionsToProps)(GameView);
