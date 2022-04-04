import React, { useState, useEffect } from "react";
import chipsImage from "../img/icons8-casino-chips-66.png";
import { connect } from "react-redux";

function Pot(props) {
    const [pot, updatePot] = useState(0);
    useEffect(() => {
        updatePot(props.user.pot);
    }, [pot]);
    return (
        <div className="pot">
            <img src={chipsImage} />
            <span>{props.user.pot}</span>
        </div>
    );
}

const mapStateToProps = (state) => {
    return { user: state.user };
};
const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Pot);
