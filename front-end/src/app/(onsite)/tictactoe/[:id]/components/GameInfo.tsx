import geistSans from "@/app/fonts/geistSans";
import Image from "next/image";
import { useXO } from "../contexts/xoContext";
import { useGame } from "@/app/(onsite)/contexts/gameContext";

type gameInfoType = {
	pl1: number;
	pl2: number;
	round: number;
	turn: "pl1" | "pl2";
};

function GameInfo({ gameInfo: { pl1, pl2, round, turn } }: { gameInfo: gameInfoType }) {
	const { secondsLeft } = useXO();
	const { playerOne, playerTwo } = useGame();

	let player1 = !playerOne.name || playerOne.name === "" ? "Darth Vader" : playerOne.name;
	if (player1 && player1.length > 20) player1 = player1.substring(0, 20) + "...";

	let player2 = !playerTwo.name || playerTwo.name === "" ? "Lord Voldmort" : playerTwo.name;
	if (player2 && player2.length > 20) player2 = player2.substring(0, 20) + "...";

	return (
		<>
			<div className="min-h-20 flex max-h-20 select-none items-center justify-between gap-10 px-2">
				<div
					className={`hover:scale-102 flex w-full flex-1 select-none
						items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500
						${turn === "pl1" ? "border-main" : "border-white/4"}
						`}
				>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
						w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={playerOne.img}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
					<p className="text-wrap flex-1">{player1}</p>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>
					{pl1}
				</div>
				<div
					className={`bg-white/8 ring-white/15 *:flex *:items-center *:justify-center
					transform-all hover:scale-102 flex h-full w-full flex-[0.5]
					flex-col rounded-full text-center ring-1
					duration-700
					${geistSans.className}`}
				>
					<span className={`flex-1 text-3xl font-light`}>{secondsLeft}</span>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>
					{pl2}
				</div>
				<div
					className={`hover:scale-102 flex w-full flex-1 select-none
							items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500
							${turn === "pl2" ? "border-main" : "border-white/4"}
							`}
				>
					<p className="text-wrap flex-1 text-right">{player2}</p>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
						w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={playerTwo.img}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-10 flex w-full select-none justify-center">
				<p
					className="w-35 border-white/4 hover:scale-102 flex h-full items-center justify-between
							rounded-full border-2 bg-white/5 px-4 transition-all duration-500"
				>
					<span className="font-light">Round</span>&nbsp;
					<span className={`${geistSans.className} text-xl font-bold`}>{round}</span>
				</p>
			</div>
		</>
	);
}

export default GameInfo;
