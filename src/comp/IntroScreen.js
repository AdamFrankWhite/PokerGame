import React from "react";
import logo from "../logo.svg";
import { useState } from "react";
export default function IntroScreen(props) {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    return (
        <header>
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to PokerApp. </h2>
            <p>Enter your name to begin.</p>
            {/* <select onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy" selected>
                    Please...go easy on me
                </option>
                <option value="medium">I know the fundamentals...</option>
                <option value="hard">I am a poker GOD! Bring it on!</option>
            </select> */}
            <input type="text" onChange={(e) => setName(e.target.value)} />
            <button
                onClick={() => {
                    console.log(name, difficulty);
                    if (name && difficulty) {
                        props.createGame(name, difficulty);
                    }
                }}
            >
                Enter
            </button>
        </header>
    );
}
