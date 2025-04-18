import { Circle, X } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Colors from "./Items/Colors";
import Board from "./Items/Board";
import Rounds from "./Items/Rounds";
import Player from "./Items/Player";
import ResetButton from "./Items/ResetButton";
import { useGame } from "../../contexts/gameContext";

function TicTacToeOptions() {
	const {
		boardColor,
		setBoardColor,
		xColor,
		setXColor,
		oColor,
		setOColor,
		round,
		setRound,
		reset,
		setReset,
		playerOne,
		setPlayerOneName,
		playerTwo,
		setPlayerTwoName,
		connectivity,
	} = useGame();

	const defaultXColor = "bg-red-700";
	const defaultOColor = "bg-yellow-500";
	const defaultRound = 5;
	const defaultBoardColor = "bg-theme-one";

	function resetValues() {
		// API to get the default values of the colors & round
		setXColor(defaultXColor);
		setOColor(defaultOColor);
		setBoardColor(defaultBoardColor);
		setRound(defaultRound);
	}

	useEffect(() => {
		// API to get the default values of the colors & round
		if (
			xColor !== defaultXColor ||
			oColor !== defaultOColor ||
			round !== defaultRound ||
			boardColor !== defaultBoardColor
		) {
			setReset(true);
		} else {
			setReset(false);
		}
	}, [boardColor, connectivity, oColor, round, xColor, setReset]);

	function handleSet(
		setFunction: (value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500") => void,
		value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500",
		rvalue: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500"
	) {
		if (value === rvalue) {
			const colors: ("bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500")[] = [
				"bg-red-700",
				"bg-yellow-500",
				"bg-blue-600",
				"bg-cyan-500",
			];
			const nextIndex = (colors.indexOf(value) + 1) % colors.length;
			setFunction(colors[nextIndex]);
		} else {
			setFunction(value);
		}
	}

	return (
		<>
			<Colors handleSet={handleSet} setColor={setXColor} Color={oColor} innerColor={xColor} label={"Color"}>
				<X size={28} weight="bold" />
			</Colors>
			<Colors handleSet={handleSet} setColor={setOColor} Color={xColor} innerColor={oColor} label={"Color"}>
				<Circle size={28} weight="bold" />
			</Colors>
			<Board label="Board Color" boardColor={boardColor} setBoardColor={setBoardColor} />
			<AnimatePresence>
				{connectivity !== "online" && <Rounds round={round} setRound={setRound} />}
			</AnimatePresence>
			<AnimatePresence>
				{connectivity === "offline" && (
					<>
						<Player label="Player 1" value={playerOne.name} setValue={setPlayerOneName} />
						<Player label="Player 2" value={playerTwo.name} setValue={setPlayerTwoName} />
					</>
				)}
			</AnimatePresence>
			{reset && <ResetButton resetValues={resetValues} />}
		</>
	);
}

export default TicTacToeOptions;
