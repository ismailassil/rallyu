import { useEffect, useState } from "react";
import fustat from "@/app/fonts/Fustat";

const GameTimer = ({ time }: { time: number }) => {
    const [ gameTime, setGameTime ] = useState(0);

    useEffect(() => {
        if (time <= 0) return ;

        setGameTime(time);
        const interval = setInterval(() => {
            setGameTime(prev => prev - 1);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [time])

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div 
            className={`flex ${fustat.className} items-center justify-center pl-4 font-bold text-3xl text-right tracking-widest gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-full p-2 w-[160px] h-[70px] min-w-0`}
        >
            {formatTime(gameTime)}
        </div>
    );
}

export default GameTimer;