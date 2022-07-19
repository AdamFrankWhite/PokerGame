import React from "react";
import trophy from "../img/trophy.svg";
import loser from "../img/loser.svg";
import { useState } from "react";
export default function GameOverScreen(props) {
    return (
        <header>
            <img
                src={props.winner == "computer" ? loser : trophy}
                className="App-logo"
                alt="logo"
            />
            {props.winner == "computer" ? (
                <h2>Sorry. Better luck next time</h2>
            ) : (
                <h2>Congratulations. You are a poker titan.</h2>
            )}

            <button
                onClick={() => {
                    props.createGame("name", "");
                }}
            >
                New Game
            </button>
        </header>
    );
}
