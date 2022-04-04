import "./App.css";
import { useState } from "react";
import IntroScreen from "./comp/IntroScreen";
import GameView from "./comp/GameView";

function App() {
    const [user, setUser] = useState("");
    const createGame = (newGame, name) => {
        if (newGame) {
            setUser(name);
        }
    };

    return (
        <div className="App">
            {user ? (
                <GameView name={user} />
            ) : (
                <IntroScreen createGame={createGame} />
            )}
        </div>
    );
}

export default App;
