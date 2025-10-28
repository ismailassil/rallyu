import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Countdown = ({ text }: { text: string }) => {
    const sequence = [3, 2, 1, text];
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
                    className={`text-5xl lg:text-7xl 2xl:text-9xl font-funnel-display font-bold`}
                >
                    {sequence[index]}
                </motion.span>
            )}
        </AnimatePresence>
    </div>
    );
};

export default Countdown
