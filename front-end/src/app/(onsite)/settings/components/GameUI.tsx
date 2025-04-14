import { useState } from "react";
import { Globe, Hash, PingPong, WifiSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";

function GameUI() {
	const [game, setGame] = useState(0);
	const [connectivity, setConnectivity] = useState(0);
	const [boardColor, setBoardColor] = useState(0);

	return (
		<motion.div
			className="h-full w-full p-4 flex flex-col gap-3 max-w-220 hide-scrollbar overflow-scroll"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ type: "spring", stiffness: 120 }}
		>
			<div>
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Default customization
				</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
				<label className="flex-1 w-full" htmlFor="picture">
					Default Game
				</label>
				<div className="flex-2 w-full">
					<div
						className="flex gap-2 border-2 border-white/10
							*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
							*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
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
			</div>
			<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
				<label className="flex-1 w-full" htmlFor="picture">
					Base Connectivity Mode
				</label>
				<div className="flex-2 w-full">
					<div
						className="flex gap-2 border-2 border-white/10
							*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
							*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
					>
						<div
							onClick={(e) => {
								e.preventDefault();
								setConnectivity(0);
							}}
							className={`w-full ${connectivity === 0 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
						>
							<Globe size={18} />
							Online
						</div>
						<div
							onClick={(e) => {
								e.preventDefault();
								setConnectivity(1);
							}}
							className={`w-full ${connectivity === 1 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
						>
							<WifiSlash size={18} />
							Local
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
				<label className="flex-1 w-full" htmlFor="picture">
					Default board color
				</label>
				<div className="flex-2 w-full">
					<div
						className="flex gap-2 border-2 border-white/10 *:h-10
							*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
							*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
					>
						<div
							onClick={(e) => {
								e.preventDefault();
								setBoardColor(0);
							}}
							className={`w-full bg-[radial-gradient(circle,_#006400,_#36454F)]
								${boardColor === 0 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
						></div>
						<div
							onClick={(e) => {
								e.preventDefault();
								setBoardColor(1);
							}}
							className={`w-full bg-[radial-gradient(circle,_#000080,_#000000)]
								${boardColor === 1 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
						></div>
						<div
							onClick={(e) => {
								e.preventDefault();
								setBoardColor(2);
							}}
							className={`w-full bg-[radial-gradient(circle,_#26add7,_#0473bc)]
								${boardColor === 2 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
						></div>
						<div
							onClick={(e) => {
								e.preventDefault();
								setBoardColor(3);
							}}
							className={`w-full bg-[radial-gradient(circle,_#41a876,_#d3c8ab)]
								${boardColor === 3 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
						></div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default GameUI;
