import { useRef, useState } from "react";
import LocalPong from "../../src/game/LocalPong";
import Overlay from "./Overlay";
import Pong from "../../src/Pong";
import GameTimer from "../../../components/Items/GameTimer";

const GameField = () => {
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ pauseTimer, setPauseTimer ] = useState(false);
	const pong = useRef<LocalPong>(new LocalPong({ updateTimer: setTimeLeft }));

    console.log('TimeLeft', timeLeft);

    const pauseGame = () => {
        if (pong.current.gamePlayStatus === 'gameover' || pong.current.gamePlayStatus === 'countdown') return;
        
        pong.current.pauseGame();
        setPauseTimer(!pauseTimer);
    }

    const resetGame = () => {
        pong.current.reset();
        setPauseTimer(false);
    }

	return (
        <>
            <GameTimer time={timeLeft} pause={pauseTimer}/>
            {/* <VersusCard /> */}
            <div className="flex w-auto h-auto max-h-full max-w-full items-center justify-center">
                <div className="relative inline-block">
                    <Pong socketProxy={null} pong={pong.current} />
                    <Overlay pauseHandler={pauseGame} resetHandler={resetGame} />
                </div>
            </div>
        </>
	);
};

export default GameField;