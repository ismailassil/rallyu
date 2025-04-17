import { Hash, PingPong } from "@phosphor-icons/react";
import { motion } from "framer-motion";

function PickGame({
	label,
	game,
	setGame,
	className,
}: {
	className?: string;
	label: string;
	game: number;
	setGame: (value: number) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className={`flex flex-col items-center justify-between gap-2 md:flex-row ${
				!className ? "lg:gap-10" : className
			} lg:min-h-11 text-sm lg:text-base`}
		>
			<label className="w-full flex-1" htmlFor="picture">
				{label}
			</label>
			<div className={`${className ? "flex-2" : "flex-3"} w-full`}>
				<div
					className="*:flex *:justify-center *:items-center *:px-1
						*:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
						rounded-md border-2 border-white/10 px-1 py-1"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setGame(0);
						}}
						className={`w-full ${game === 0 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<PingPong size={18} />
						Ping Pong
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setGame(1);
						}}
						className={`w-full ${game === 1 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<Hash size={18} />
						Tic Tac Toe
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default PickGame;
