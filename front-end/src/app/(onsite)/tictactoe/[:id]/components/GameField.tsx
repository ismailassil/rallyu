import { useEffect, useRef, useState } from "react";
import Cell from "./Items/Cell";
import dmSans from "@/app/fonts/dmSans";
import { Dispatch, SetStateAction } from "react";
import { useGame } from "@/app/(onsite)/contexts/gameContext";
import { useXO } from "../contexts/xoContext";
import useCountdown from "../tools/useCountdown";

type gameInfoType = {
	pl1: number;
	pl2: number;
	round: number;
	turn: "pl1" | "pl2";
};

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function GameField({
	gameInfo,
	setGameInfo,
	setGameEnd,
}: {
	gameInfo: gameInfoType;

	setGameInfo: Dispatch<SetStateAction<gameInfoType>>;
	setGameEnd: Dispatch<SetStateAction<boolean>>;
}) {
	const { secondsLeft: startSeconds, setStart: setStartSeconds } = useCountdown();
	const { round, boardColor, xColor, oColor } = useGame();
	const { secondsLeft, setStart } = useXO();
	const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
	const [go, setGo] = useState("cross");
	const [startGame, setStartGame] = useState(false);
	const xColour = useRef("");
	const oColour = useRef("");

	useEffect(() => {
		xColour.current = xColor.replace("bg-", "text-");
		oColour.current = oColor.replace("bg-", "text-");
	}, [xColor, oColor]);

	useEffect(() => {
		setStartSeconds(3);

		const timer = setTimeout(() => {
			setStart(15);
			setStartGame(true);
		}, 3000);

		return () => clearTimeout(timer);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!startGame) return;

		if (round + 1 === gameInfo.round) {
			setGameEnd(true);
			return;
		}

		function checkWinner(player: "circle" | "cross") {
			return winningCombos.some((combo) => combo.every((cell) => cells[cell] === player));
		}

		function resetRound(winner: "pl1" | "pl2" | null) {
			setCells(Array(9).fill(""));
			setGo("cross");
			setGameInfo((prev) => ({
				...prev,
				round: prev.round + 1,
				turn: prev.turn === "pl1" ? "pl2" : "pl1",
				...(winner !== null
					? { [winner]: prev[winner] + 1 }
					: { pl1: prev["pl1"] + 1, pl2: prev["pl2"] + 1 }),
			}));
			setStart(15);
		}

		if (checkWinner("cross")) {
			resetRound(gameInfo.turn === "pl1" ? "pl1" : "pl2");
		} else if (checkWinner("circle")) {
			resetRound(gameInfo.turn === "pl1" ? "pl2" : "pl1");
		} else if (cells.every((cell) => cell !== "")) {
			resetRound(null);
		} else if (secondsLeft === 0) {
			resetRound(gameInfo.turn === "pl1" ? "pl2" : "pl1");
		}
	}, [cells, gameInfo, setGameInfo, secondsLeft, setStart, round, startGame, setGameEnd]);

	return (
		<div
			className={`"min-h-200 relative mt-5 flex h-[calc(100%-120px)]	
				w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20
				p-10 ${boardColor}`}
		>
			{startSeconds >= 1 && (
				<div
					className={`gameLoader absolute flex h-full w-full items-center justify-center
							bg-white/5 ${dmSans.className} text-9xl`}
				>
					{startSeconds}
				</div>
			)}
			<div className="w-150 h-150 grid select-none grid-cols-3 grid-rows-3 gap-5">
				{cells.map((cell, i) => (
					<Cell
						key={i}
						id={i}
						go={go}
						setGo={setGo}
						cells={cells}
						setCells={setCells}
						cell={cell}
						disabled={!startGame}
						xColor={xColour.current}
						oColor={oColour.current}
					/>
				))}
			</div>
		</div>
	);
}

export default GameField;
