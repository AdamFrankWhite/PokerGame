import "./App.css";
import { useState } from "react";
import IntroScreen from "./comp/IntroScreen";
import GameView from "./comp/GameView";

function App() {
    const [user, setUser] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const createGame = (newGame, name, difficulty) => {
        if (newGame) {
            setUser(name);
            setDifficulty(difficulty);
        }
    };

    return (
        <div className="App">
            {user ? (
                <GameView name={user} difficulty={difficulty} />
            ) : (
                <IntroScreen createGame={createGame} />
            )}
        </div>
    );
}

export default App;
