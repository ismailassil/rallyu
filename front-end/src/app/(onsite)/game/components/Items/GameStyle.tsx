import { useGame } from "@/app/(onsite)/contexts/gameContext";
import { Brain, Globe, WifiSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";

function GameStyle() {
	const { connectivity, setConnectivity } = useGame();

	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className="lg:min-h-11 flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-10 lg:text-base"
		>
			<label className="w-full flex-1" htmlFor="picture">
				Gameplay Style
			</label>
			<div className="flex-3 w-full">
				<div
					className="*:flex *:justify-center *:items-center *:px-1
									*:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
									rounded-md border-2 border-white/10 px-1 py-1"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setConnectivity("online");
						}}
						className={`w-full ${
							connectivity === "online" ? "bg-white text-black" : "hover:bg-white hover:text-black"
						}`}
					>
						<Globe size={18} />
						Online
					</div>
					<div
						className={`w-full ${
							connectivity === "practice" ? "bg-white text-black" : "hover:bg-white hover:text-black"
						}`}
						onClick={(e) => {
							e.preventDefault();
							setConnectivity("practice");
						}}
					>
						<Brain size={18} />
						Practice
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setConnectivity("offline");
						}}
						className={`w-full ${
							connectivity === "offline" ? "bg-white text-black" : "hover:bg-white hover:text-black"
						}`}
					>
						<WifiSlash size={18} />
						Offline
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default GameStyle;
