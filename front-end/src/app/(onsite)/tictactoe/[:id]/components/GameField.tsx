import { useEffect, useState } from "react";
import Cell from "./Items/Cell";

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

function GameField() {
	const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
	const [go, setGo] = useState("cross");
	const [msg, setMsg] = useState(false);

	useEffect(() => {
		winningCombos.forEach((combo) => {
			const circleWins = combo.every((cell) => cells[cell] === "circle");
			const crossWins = combo.every((cell) => cells[cell] === "cross");

			if (circleWins) {
				setMsg(true);
			} else if (crossWins) {
				setMsg(true);
			}
		});
	}, [cells]);

	return (
		<div
			className="min-h-200 relative mt-5 flex h-[calc(100%-120px)]	
				w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20
				bg-black/10 p-10"
		>
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
						isWon={msg}
					/>
				))}
			</div>
		</div>
	);
}

export default GameField;
