import { Circle, X } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Colors from "./Items/Colors";
import Board from "./Items/Board";
import Rounds from "./Items/Rounds";
import Player from "./Items/Player";
import ResetButton from "./Items/ResetButton";

function TicTacToeOptions({ connectivity }: { connectivity: number }) {
	const [boardColor, setBoardColor] = useState(0);
	const [xColor, setXColor] = useState(0);
	const [oColor, setOColor] = useState(1);
	const [round, setRound] = useState(0);
	const [reset, setReset] = useState(false);
	const [playerOne, setPlayerOne] = useState("");
	const [playerTwo, setPlayerTwo] = useState("");

	function resetValues() {
		setXColor(0);
		setOColor(1);
		setBoardColor(0);
		setRound(0);
	}

	useEffect(() => {
		if (xColor !== 0 || oColor !== 1 || round !== 0 || boardColor !== 0) {
			setReset(true);
		} else {
			setReset(false);
		}
	}, [boardColor, connectivity, oColor, round, xColor]);

	function handleSet(
		setFunction: (value: number) => void,
		value: number,
		rvalue: number
	) {
		if (value == rvalue) {
			setFunction(value + 1 > 3 ? 0 : value + 1);
		} else {
			setFunction(value);
		}
	}

	return (
		<>
			<Colors
				handleSet={handleSet}
				setColor={setXColor}
				Color={oColor}
				innerColor={xColor}
				label={"Color"}
			>
				<X size={28} weight="bold" />
			</Colors>
			<Colors
				handleSet={handleSet}
				setColor={setOColor}
				Color={xColor}
				innerColor={oColor}
				label={"Color"}
			>
				<Circle size={28} weight="bold" />
			</Colors>
			<Board
				label="Board Color"
				boardColor={boardColor}
				setBoardColor={setBoardColor}
			/>
			<AnimatePresence>
				{connectivity > 0 && <Rounds round={round} setRound={setRound} />}
			</AnimatePresence>
			<AnimatePresence>
				{connectivity > 1 && (
					<>
						<Player
							label="Player 1"
							value={playerOne}
							setValue={setPlayerOne}
						/>
						<Player
							label="Player 2"
							value={playerTwo}
							setValue={setPlayerTwo}
						/>
					</>
				)}
			</AnimatePresence>
			{reset && <ResetButton resetValues={resetValues} />}
		</>
	);
}

export default TicTacToeOptions;
