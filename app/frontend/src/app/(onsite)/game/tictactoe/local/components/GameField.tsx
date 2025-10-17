import { useRef, useState } from "react";
import LocalPong from "../../src/game/LocalXO";
import Overlay from "./Overlay";
import GameTimer from "../../../components/Items/GameTimer";

const GameField = () => {
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ pause, setPause ] = useState(false);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
	const pong = useRef<LocalPong>(new LocalPong({
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus
    }));

    const redoMove = () => {
        pong.current.pauseGame();

        if (pong.current.gamePlayStatus !== 'gameover' && pong.current.gamePlayStatus !== 'countdown')
            setPause(!pause);
    }

    const undoMove = () => {
        pong.current.reset();
        setPause(false);
    }

    const resetGame = () => {
        pong.current.reset();
        setPause(false);
    }

	return (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
            <GameTimer time={timeLeft} pause={pause}/>
            {/* <VersusCard /> */}
            <div className="flex w-auto h-auto max-h-full max-w-full items-center justify-center">
                <div className="relative inline-block">
                    <TicTacToe
                        socketProxy={null}
                        pong={pong.current}
                    />
                    
                    <Overlay
                        undoHandler={undoMove}
                        redoHandler={redoMove}
                        resetHandler={resetGame}
                        status={overlayStatus}
                    />
                </div>
            </div>
        </div>
	);
};

export default GameField;