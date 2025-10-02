import ibm from "@/app/fonts/ibm";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../../contexts/gameContext";

const GameTimer = () => {
    const { gameTime, setGameTime } = useGame();

    useEffect(() => {
        if (gameTime <= 0) return ;

        const interval = setInterval(() => {
            setGameTime(t => t - 1);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [gameTime > 0])

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div className={`flex ${ibm.className} flex-row justify-center items-center font-bold text-4xl tracking-widest gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-lg p-2 w-[180px] h-[80px] min-w-0`}>
            {formatTime(gameTime)}
        </div>
    );
}

export default GameTimer;