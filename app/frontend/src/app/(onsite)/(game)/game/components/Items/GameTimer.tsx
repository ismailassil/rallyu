import { useEffect } from "react";
import { useGame } from "../../contexts/gameContext";

const GameTimer = () => {
    const { gameState, updateGameState } = useGame();

    useEffect(() => {
        if (gameState.gameTime <= 0) return ;

        const interval = setInterval(() => {
            updateGameState(prev => ({ 
                gameTime: prev.gameTime - 1 
            }));
        }, 1000);
        
        return () => clearInterval(interval);
    }, [gameState.gameTime > 0])

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div 
            className={`flex items-center justify-center pl-4 font-bold text-3xl text-right tracking-widest gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-full p-2 w-[160px] h-[70px] min-w-0`}
            style={{
                fontFamily: 'AtariPongScore' 
            }}
        >
            {formatTime(gameState.gameTime)}
        </div>
    );
}

export default GameTimer;