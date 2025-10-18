import useMatchmaking from "@/app/hooks/useMatchMaking";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const GameOver = ({ display }: { display: string }) => {
    const router = useRouter();
    const { queueTime, isSearching, toggleSearch } = useMatchmaking('tictactoe');

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};
    return (
        <div className={`absolute inset-0 m-auto p-3 flex flex-col justify-between w-[clamp(170px,20%,100%)] h-[clamp(100px,20%,100%)] border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg transition-all duration-300 ease-in-out ${status !== 'none' ? 'opacity-100 translate-y-0': 'translate-y-20 opacity-0'}`}>
            <span className='flex flex-1 text-4xl whitespace-nowrap mb-5 font-funnel-display font-bold justify-center items-center'>
                {display}
            </span>
            <div className="inline-flex gap-2 ">
                <button
                    onClick={() => router.push('/game')}
                    className="inline-flex flex-1 justify-center py-4 items-center gap-1 rounded-lg bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                >
                    <ArrowLeft className="w-[20px] h-[20px]"/>
                    <span className="text-xl font-extrabold font-funnel-display">Lobby</span>
                </button>
                <button
                    onClick={toggleSearch}
                    className={`inline-flex flex-1 justify-center py-4 items-center gap-1 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 ${isSearching ? 'animate-pulse' : ''}`}
                >
                    <Plus className={`w-5 h-5 transition-all duration-300 ${isSearching && 'rotate-45'}`}/>
                    <span className={`inline-flex text-xl font-extrabold text-nowrap font-funnel-display ${isSearching && 'scale-105'}`}>
                        { isSearching
                            ? `In Queue... ${formatTime(queueTime)}`
                            : 'New Match'
                        }
                    </span>
                </button>
            </div>
        </div>
    )
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Countdown = ({ round }: { round: number }) => {
    const sequence = [3, 2, 1, `Round ${round}`];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIndex((i) => i + 1), 750);
        return () => clearTimeout(timer);
    }, [index]);

    return (
    <div className="flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
            {index < sequence.length && (
                <motion.span
                    key={sequence[index]}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`text-5xl lg:text-7xl font-funnel-display font-bold`}
                >
                    {sequence[index]}
                </motion.span>
            )}
        </AnimatePresence>
    </div>
    );
};

const Overlay = ({ status, result, round }: { status: string, result: string | null, round: number }) => { // status: gameover wait play countdown none | result: win loss draw
    

    return (
        <div className={`absolute inset-0 w-full ${status !== 'gameover' && 'pointer-events-none'} h-full`}>
            <div className={`absolute inset-0  rounded-lg transition-all duration-150 w-full h-full`}>
                {result && <GameOver display={result} />}
                {status === 'countdown' && <Countdown round={round} />}
            </div>
        </div>
    )
}

export default Overlay;