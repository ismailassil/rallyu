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
			className={`flex justify-between flex-col md:flex-row items-center gap-2 ${!className ? "lg:gap-10" : className} text-sm lg:text-base lg:min-h-11`}
		>
			<label className="flex-1 w-full" htmlFor="picture">
				Rounds
			</label>
			<div className={`${className ? "flex-2" : "flex-3"} w-full`}>
				<div
					className="flex gap-2 border-2 border-white/10 min-h-11
						*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
						*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
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
