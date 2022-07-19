import React from "react";
import trophy from "../img/trophy.svg";
import loser from "../img/loser.svg";
import { useState } from "react";
import { connect } from "react-redux";
function GameOverScreen(props) {
    return (
        <header>
            <img
                src={props.winner == "computer" ? loser : trophy}
                className="App-logo"
                alt="logo"
            />
            {props.winner == "computer" ? (
                <h2>Sorry {props.user.playerName}. Better luck next time</h2>
            ) : (
                <h2>
                    Congratulations, {props.user.playerName}. You are a poker
                    titan.
                </h2>
            )}

            <button
                onClick={() => {
                    props.createGame(props.user.playerName, "");
                }}
            >
                New Game
            </button>
        </header>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(GameOverScreen);
