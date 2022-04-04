import React, { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { connect } from "react-redux";
function ComputerTimer(props) {
    const [thinkingTimer, setThinkingTimer] = useState(false);
    const thinkingDuration = Math.floor(Math.random() * 3000);
    console.log(thinkingDuration);
    useEffect(() => {
        props.user.thinkingTimer
            ? setThinkingTimer(props.user.thinkingTimer)
            : setTimeout(() => {
                  setThinkingTimer(props.user.thinkingTimer);
              }, thinkingDuration);
    }, [props.user.thinkingTimer]);
    return (
        <div className="thinking-timer">
            {/* {thinkingTimer && (
                <CountdownCircleTimer
                    isPlaying
                    duration={3}
                    colors={["#f2fff5", "#f3fff5", "#f6fff5", "#ffffff"]}
                    colorsTime={[7, 5, 2, 0]}
                    size={100}
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
            )} */}
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
