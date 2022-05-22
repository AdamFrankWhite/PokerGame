import React, { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { connect } from "react-redux";
function ComputerTimer(props) {
    const [thinkingTimer, setThinkingTimer] = useState(false);
    const thinkingDuration = Math.floor(Math.random() * 5);
    // console.log(thinkingDuration);
    // useEffect(() => {
    //     props.user.thinkingTimer
    //         ? setThinkingTimer(props.user.thinkingTimer)
    //         : setTimeout(() => {
    //               setThinkingTimer(props.user.thinkingTimer);
    //           }, thinkingDuration);
    // }, [props.user.thinkingTimer]);
    return (
        <div className="thinking-timer">
            {props.user.playerTurn == "computer" && (
                <CountdownCircleTimer
                    className="timer"
                    isPlaying
                    duration={5}
                    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                    colorsTime={[7, 5, 2, 0]}
                    size={60}
                >
                    <span style={{ color: "white" }}>
                        {({ remainingTime }) => remainingTime}
                    </span>
                </CountdownCircleTimer>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(ComputerTimer);
