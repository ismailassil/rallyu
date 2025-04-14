import geistSans from "@/app/fonts/geistSans";
import unicaOne from "@/app/fonts/unicaOne";
import { Brain, Globe, Hash, PingPong, WifiSlash } from "@phosphor-icons/react";
import { useState } from "react";

function GamePanel() {
	const [game, setGame] = useState(0);

	return (
		<div className="flex-1 h-full flex flex-col">
			<h1
				className={`text-4xl p-4 ${unicaOne.className} uppercase font-semibold`}
			>
				<span className="font-semibold">Custom Your World!</span>
			</h1>
			<div className={`h-full p-4 flex flex-col gap-5`}>
				<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-10 text-sm lg:text-base">
					<label className="flex-1 w-full" htmlFor="picture">
						Pick Your Game
					</label>
					<div className="flex-3 w-full">
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
				<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-10 text-sm lg:text-base">
					<label className="flex-1 w-full" htmlFor="picture">
						Gameplay Style
					</label>
					<div className="flex-3 w-full">
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
								<Globe size={18} />
								Online
							</div>
							<div
								onClick={(e) => {
									e.preventDefault();
									setGame(0);
								}}
								className={`w-full ${game === 2 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
							>
								<Brain size={18} />
								Practice
							</div>
							<div
								onClick={(e) => {
									e.preventDefault();
									setGame(1);
								}}
								className={`w-full ${game === 3 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
							>
								<WifiSlash size={18} />
								Offline
							</div>
						</div>
					</div>
				</div>
			</div>
			<button
				className={`${geistSans.className} w-full h-13
					text-lg font-semibold bg-main rounded-md uppercase cursor-pointer
					hover:scale-101 transition-all duration-300 hover:bg-main-hover
					`}
			>
				Start
			</button>
		</div>
	);
}

export default GamePanel;
