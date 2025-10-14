import { useEffect, useState } from "react";
import fustat from "@/app/fonts/Fustat";

const GameTimer = ({ time }: { time: number }) => {
    const [ gameTime, setGameTime ] = useState(0);

    useEffect(() => {
        setGameTime(time);
        const interval = setInterval(() => {
            setGameTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1
            });
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
            className={`flex font-funnel-display text-black items-center justify-center font-bold text-3xl text-right tracking-widest rounded-t-2xl mb-[1px] bg-white/90 w-[140px] h-[60px] min-w-0`}
        >
            {formatTime(gameTime)}
        </div>
    );
}

export default GameTimer;