import React, { useEffect, useState } from "react";
import avatar1 from "../img/avatar-1.png";
import avatar2 from "../img/avatar-2.png";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { connect } from "react-redux";
function Avatar(props) {
    return (
        <div className={"avatar " + props.id}>
            <img
                src={props.player == "computer" ? avatar1 : avatar2}
                alt="avatar"
            />
            <div className="avatar-text">
                <p className="chip-count">{props.chips}</p>
                <h2>{props.name}</h2>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Avatar);
