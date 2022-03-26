import React from "react";
import logo from "../logo.svg";
import { useState } from "react";
export default function IntroScreen(props) {
    const [name, setName] = useState("");

    return (
        <header>
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to PokerApp. </h2>
            <p>Enter your name to begin.</p>

            <input type="text" onChange={(e) => setName(e.target.value)} />
            <button onClick={() => props.createGame(true, name)}>Enter</button>
        </header>
    );
}
