"use client";
import { motion } from "framer-motion";
import { useGameContext } from "../contexts/gameContext";
import { RefObject, useEffect, useRef } from "react";

const MatchConfirmation = function (props) {
	const { ws } = useGameContext();
	const timer: RefObject<NodeJS.Timeout | undefined> = useRef<NodeJS.Timeout | undefined>(undefined);

	const acceptHandler = function (e) {
		e.preventDefault();
		ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 1 }));
	};

	const cancelHandler = function (e) {
		e.preventDefault();
		ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 0 }));
	};

	useEffect(() => {
	    timer.current = setTimeout(() => {
	        ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 0 }));
	    }, 10000);

	    return () => {
	        clearTimeout(timer.current);
	    };

	}, [ws]);

	return (
		<>
			<div className="bg-card border-br-card absolute z-20 h-[53%] w-[52%] overflow-hidden rounded-3xl border-2">
				<motion.div
					className="z-10 h-full w-full origin-bottom bg-yellow-500 bg-cover bg-fixed bg-center"
					animate={{ scaleY: 0 }}
					transition={{ duration: 8, delay: 1 }}
				/>
			</div>
			<div
				className="absolute z-30 flex h-1/2 w-1/2 flex-col justify-center gap-24 rounded-2xl bg-[url(/background/match/ping-pong-cover1.jpg)]
                    bg-cover bg-center backdrop-blur-sm"
			>
				<div className="flex flex-col items-center justify-center gap-1">
					<motion.h1
						className="bg-linear-to-r from-yellow-600 to-cyan-300 bg-clip-text bg-left text-5xl font-black
                        text-transparent"
						initial={{ backgroundPosition: "0% 0%" }}
						animate={{ backgroundPosition: "100% 0%" }}
						transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
					>
						MATCH FOUND
					</motion.h1>
					<p className="text-xl font-bold tracking-normal text-yellow-500">Mode: Ping-Pong</p>
				</div>
				<div className=" flex justify-center gap-24 text-lg font-semibold">
					<button
						type="button"
						className="bg-linear-to-r rounded-full bg-blue-900 px-12 py-4 transition-all
                                    duration-300 hover:cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-700/50"
						onClick={acceptHandler}
					>
						ACCEPT!
					</button>
					<button
						type="button"
						className="bg-op rounded-full bg-gray-600/70 px-12 py-4 backdrop-blur-sm transition-all duration-300
                                    hover:cursor-pointer hover:ring-2 hover:ring-gray-300/50"
						onClick={cancelHandler}
					>
						DECLINE
					</button>
				</div>
			</div>
		</>
	);
};

export default MatchConfirmation;
