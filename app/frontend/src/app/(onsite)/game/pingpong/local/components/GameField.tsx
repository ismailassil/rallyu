import { useRef, useState } from "react";
import LocalPong from "../../src/game/LocalPong";
import Overlay from "./Overlay";
import Pong from "../../src/Pong";
import GameTimer from "../../../components/Items/GameTimer";

const GameField = () => {
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ pause, setPause ] = useState(false);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
	const pong = useRef<LocalPong>(new LocalPong({
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus
    }));

    const pauseGame = () => {
        pong.current.pauseGame();

        if (pong.current.gamePlayStatus !== 'gameover' && pong.current.gamePlayStatus !== 'countdown')
            setPause(!pause);
    }

    const resetGame = () => {
        pong.current.reset();
        setPause(false);
    }

	return (
        <div className="flex px-8 min-h-0 w-full flex-1 flex-col items-center overflow-auto justify-center">
            <div className="flex flex-col w-auto h-auto max-h-full max-w-full items-center justify-center">
                <GameTimer time={timeLeft} pause={pause}/>
                <div className="relative inline-block">
                    <Pong
                        socketProxy={null}
                        pong={pong.current}
                    />
                    
                    <Overlay
                        pauseHandler={pauseGame}
                        resetHandler={resetGame}
                        status={overlayStatus}
                    />
                </div>
            </div>
        </div>
	);
};

export default GameField;