import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameOver from "../../../components/Items/GameOverRemote";

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
                    transition={{ duration: 0.25, ease: "easeInOut" }}
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
                {result && <GameOver display={result} game="tictactoe" />}
                {status === 'countdown' && <Countdown round={round} />}
            </div>
        </div>
    )
}

export default Overlay;