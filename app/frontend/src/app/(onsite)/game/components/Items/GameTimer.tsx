import { useEffect, useState } from "react";

const GameTimer = ({ time, pause, className }: { time: number, pause?: boolean | null, className?: string }) => {
    const [displayTime, setDisplayTime] = useState(time);

    useEffect(() => {
        setDisplayTime(time);
    }, [time]);

    useEffect(() => {
        if (pause) return;

        const intervalMs = 100;
        const interval = setInterval(() => {
            setDisplayTime(prev => {
                const newTime = prev - intervalMs;
                return newTime >= 0 ? newTime : 0;
            });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [pause]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div 
            className={`flex font-funnel-display text-black items-center
                justify-center font-bold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-right tracking-widest
                rounded-t-2xl mb-[1px] bg-white/90 w-[95px] h-[35px] lg:w-[100px] lg:h-[40px] xl:w-[120px] xl:h-[50px] 2xl:w-[140px] 2xl:h-[60px] min-w-0 ${className || ''}`}
        >
            {formatTime(displayTime)}
        </div>
    );
}

export default GameTimer;