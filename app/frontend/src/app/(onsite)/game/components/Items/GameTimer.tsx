import { useEffect, useState } from "react";

const GameTimer = ({ time, pause }: { time: number, pause: boolean | null }) => {
    const [ gameTime, setGameTime ] = useState(0);

    console.log('GameTimer time: ', time);

    useEffect(() => {
        setGameTime(time);
        if (pause) return;

        const intervalMs = 100;
        const interval = setInterval(() => {
            setGameTime(prev => {
                if (prev <= intervalMs) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - intervalMs;
            });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [time, pause]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div 
            className={`flex font-funnel-display text-black items-center
                justify-center font-bold text-3xl text-right tracking-widest
                rounded-t-2xl mb-[1px] bg-white/90 w-[140px] h-[60px] min-w-0`}
        >
            {formatTime(gameTime)}
        </div>
    );
}

export default GameTimer;