"use client";

import { motion } from 'framer-motion'
import Pong from "../src/Pong";
import VersusCard from "../../components/Items/VersusCard";
import { useState } from 'react';

const Game = () => {
	const [ timeLeft, setTimeLeft ] = useState(0);


	return (
        <motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
            <article className="flex gap-4 bg-card border-br-card h-full w-full justify-center rounded-2xl border-2">
                <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
                    <VersusCard timeLeft={timeLeft} />
                    <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                        <Pong socketProxy={null} mode='remote' updateTimer={setTimeLeft} />
                    </div>
                </div>
            </article>
        </motion.main>
	);
};

export default Game;