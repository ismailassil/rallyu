import unicaOne from "@/app/fonts/unicaOne";
import { ArrowLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import StartButton from "./Items/StartButton";
import { useState } from "react";
import GameChoice from "./Items/GameChoice";
import TournamentUI from "./Items/TournamentUI";
import Connectivity from "../../game/components/Items/Connectivity";
import Player from "../../game/components/Items/Player";
import TournamentTitle from "./Items/TournamentTitle";

function NewTournament({
	setValue,
	setEnter,
}: {
	setValue: (value: boolean) => void;
	setEnter: (value: boolean) => void;
}) {
	const [game, setGame] = useState(0);
	const [connectivity, setConnectivity] = useState(0);
	const [players, setPlayers] = useState<{ name: string; img: string }[]>([
		{ name: "", img: "" },
		{ name: "", img: "" },
		{ name: "", img: "" },
		{ name: "", img: "" },
	]);
	const [title, setTitle] = useState("");

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: 100 }}
				transition={{ type: "spring", stiffness: 120 }}
				className="min-h-11 flex items-center justify-between"
			>
				<div className="flex items-center gap-3 md:gap-5">
					<div
						className="bg-white/1 ring-white/13 cursor-pointer rounded-sm px-2 py-1 ring-1 transition-all
							duration-200 hover:bg-white/5 hover:ring-2 hover:ring-white/20 md:px-4"
						onClick={(e) => {
							e.preventDefault();
							setValue(false);
						}}
					>
						<ArrowLeft size={24} className="flex-1" />
					</div>
					<h2 className={`${unicaOne.className} text-xl uppercase md:text-2xl`}>
						<span className="font-semibold">Set the Stage</span>
					</h2>
				</div>
				<StartButton label="Enter the Arena" setValue={setEnter} />
			</motion.div>
			<TournamentTitle value={title} setValue={setTitle} />
			<GameChoice game={game} setGame={setGame} />
			<Connectivity connectivity={connectivity} setConnectivity={setConnectivity} />
			<TournamentUI
				players={
					connectivity === 0
						? {
								player1: {
									name: "Ismail Assil",
									img: "/profile/image_1.jpg",
								},
							}
						: {
								player1: players[0],
								player2: players[1],
								player3: players[2],
								player4: players[3],
							}
				}
			/>
			<AnimatePresence>
				{connectivity === 1 && (
					<>
						<motion.div
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 100, scale: 0.9 }}
							transition={{ type: "spring", stiffness: 120 }}
							className="grid grid-cols-none gap-5 md:grid-cols-2"
						>
							<Player
								label="Player 1"
								value={players[0].name}
								setValue={(name) =>
									setPlayers((prev) => {
										const updatedPlayers = [...prev];
										updatedPlayers[0] = {
											...updatedPlayers[1],
											name,
										};
										return updatedPlayers;
									})
								}
							/>
							<Player
								label="Player 2"
								value={players[1].name}
								setValue={(name) =>
									setPlayers((prev) => {
										const updatedPlayers = [...prev];
										updatedPlayers[1] = {
											...updatedPlayers[1],
											name,
										};
										return updatedPlayers;
									})
								}
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 100, scale: 0.9 }}
							transition={{ type: "spring", stiffness: 120 }}
							className="grid grid-cols-none gap-5 md:grid-cols-2"
						>
							<Player
								label="Player 3"
								value={players[2].name}
								setValue={(name) =>
									setPlayers((prev) => {
										const updatedPlayers = [...prev];
										updatedPlayers[2] = {
											...updatedPlayers[2],
											name,
										};
										return updatedPlayers;
									})
								}
							/>
							<Player
								label="Player 4"
								value={players[3].name}
								setValue={(name) =>
									setPlayers((prev) => {
										const updatedPlayers = [...prev];
										updatedPlayers[3] = {
											...updatedPlayers[3],
											name,
										};
										return updatedPlayers;
									})
								}
							/>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

export default NewTournament;
