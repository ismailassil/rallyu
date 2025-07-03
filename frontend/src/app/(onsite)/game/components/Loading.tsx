import geistSans from "@/app/fonts/geistSans";
import { motion } from "framer-motion";
import { useGameContext } from "../contexts/gameContext";
import MatchConfirmation from "./MatchConfirmation";

function Loading() {
	const { setLaunch, ws } = useGameContext();

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.3 }}
			className="max-w-300 flex h-full w-full flex-col items-center justify-center p-3 relative"
		>
			<h1 className="loadingText text-3xl font-bold lg:text-5xl">
				{"Setting Things Up".split("").map((char, index) => (
					<motion.span
						key={index}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.05 }}
					>
						{char}
					</motion.span>
				))}
			</h1>
			<motion.p
				className="mt-3 animate-pulse text-sm text-gray-400 lg:text-lg"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				We’re almost ready. Hang tight.
			</motion.p>
			<motion.div
				className="loader mt-5"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.7 }}
			></motion.div>
			<motion.button
				className={`${geistSans.className} max-w-50 min-h-11 lg:h-13 lg:min-h-13 hover:scale-101
									hover:text-main hover:ring-3 loader mt-10 h-11 max-h-12 w-full
									flex-1 cursor-pointer rounded-full text-base
									font-semibold uppercase ring-2 ring-white/20
									transition-all duration-300 hover:bg-white
									lg:text-lg
								`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.4 }}
				onClick={(e) => {
					e.preventDefault();
					ws.current?.send(JSON.stringify({ type: "MATCH-CANCEL" }));
					setLaunch(false);
				}}
				// disabled
			>
				Cancel
			</motion.button>
			<MatchConfirmation />
		</motion.div>
	);
}

export default Loading;
