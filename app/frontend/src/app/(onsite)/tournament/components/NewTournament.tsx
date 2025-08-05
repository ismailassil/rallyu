import unicaOne from "@/app/fonts/unicaOne";
import { ArrowLeft } from "@phosphor-icons/react";
import StartButton from "./Items/StartButton";
import { useState } from "react";
import GameChoice from "./Items/GameChoice";
import TournamentTitle from "./Items/TournamentTitle";

function NewTournament({
	setValue,
	setEnter,
}: {
	setValue: (value: boolean) => void;
	setEnter: (value: boolean) => void;
}) {
	const [game, setGame] = useState(0);
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
			{/* <TournamentUI/> */}
		</>
	);
}

export default NewTournament;
