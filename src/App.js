import "./App.css";
import { useEffect, useState } from "react";
import IntroScreen from "./comp/IntroScreen";
import GameOverScreen from "./comp/GameOverScreen";
import GameView from "./comp/GameView";
import { newGame } from "./redux/actions/userActions";
import { connect } from "react-redux";
function App(props) {
    const [user, setUser] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [gameOver, toggleGameOver] = useState(false);
    const createGame = (name, difficulty) => {
        if (name) {
            props.newGame();
            setUser(name);
            setDifficulty(difficulty);
            toggleGameOver(false);
        }
    };

    useEffect(() => {
        if (props.user.gameWinner) {
            toggleGameOver(true);
        }
    }, [props.user.gameWinner]);
    return (
        <div className="App">
            {!gameOver && user && (
                <GameView name={user} difficulty={difficulty} />
            )}
            {!gameOver && !user && <IntroScreen createGame={createGame} />}
            {gameOver && (
                <GameOverScreen
                    winner={props.user.gameWinner}
                    createGame={createGame}
                />
            )}
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapActionsToProps = {
    newGame,
};
export default connect(mapStateToProps, mapActionsToProps)(App);
