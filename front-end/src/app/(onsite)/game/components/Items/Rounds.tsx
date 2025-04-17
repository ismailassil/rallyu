import { NumberFive, NumberNine, NumberSeven } from "@phosphor-icons/react";
import { motion } from "framer-motion";

function Rounds({
	className,
	round,
	setRound,
}: {
	className?: string;
	round: number;
	setRound: (value: number) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			className={`flex flex-col items-center justify-between gap-2 md:flex-row ${
				!className ? "lg:gap-10" : className
			} lg:min-h-11 text-sm lg:text-base`}
		>
			<label className="w-full flex-1" htmlFor="picture">
				Rounds
			</label>
			<div className={`${className ? "flex-2" : "flex-3"} w-full`}>
				<div
					className="min-h-11 *:flex *:justify-center *:items-center *:px-1
						*:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
						rounded-md border-2 border-white/10 px-1 py-1"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setRound(0);
						}}
						className={`w-full ${round === 0 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<NumberFive size={18} />
					</div>
					<div
						className={`w-full ${round === 1 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
						onClick={(e) => {
							e.preventDefault();
							setRound(1);
						}}
					>
						<NumberSeven size={18} />
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setRound(2);
						}}
						className={`w-full ${round === 2 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<NumberNine size={18} />
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default Rounds;
