import { Circle, X } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import Colors from "./Items/Colors";
import Board from "./Items/Board";
import Rounds from "./Items/Rounds";
import Player from "./Items/Player";
import ResetButton from "./Items/ResetButton";
import { useTicTacToe } from "../../contexts/tictactoeContext";

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
		setPlayerOne,
		playerTwo,
		setPlayerTwo,
		connectivity,
	} = useTicTacToe();

	const defaultValues = useMemo(
		() => ({
			xColor: "bg-red-700" as "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500",
			oColor: "bg-yellow-500" as "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500",
			Round: 5 as 5 | 7 | 9,
			BoardColor: "bg-theme-one" as
				| "bg-theme-one"
				| "bg-theme-two"
				| "bg-theme-three"
				| "bg-theme-four",
		}),
		[]
	);

	function resetValues() {
		// API to get the default values of the colors & round
		setXColor(defaultValues.xColor);
		setOColor(defaultValues.oColor);
		setBoardColor(defaultValues.BoardColor);
		setRound(defaultValues.Round);
	}

	useEffect(() => {
		// API to get the default values of the colors & round
		if (
			xColor !== defaultValues.xColor ||
			oColor !== defaultValues.oColor ||
			round !== defaultValues.Round ||
			boardColor !== defaultValues.BoardColor
		) {
			setReset(true);
		} else {
			setReset(false);
		}
	}, [boardColor, connectivity, oColor, round, xColor, setReset, defaultValues]);

	function handleSet(
		setFunction: (value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500") => void,
		value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500",
		rvalue: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500"
	) {
		if (value === rvalue) {
			const colors: ("bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500")[] = [
				"bg-red-700",
				"bg-yellow-500",
				"bg-blue-600",
				"bg-teal-500",
			];
			const nextIndex = (colors.indexOf(value) + 1) % colors.length;
			setFunction(colors[nextIndex]);
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
			<Board label="Board Color" boardColor={boardColor} setBoardColor={setBoardColor} />
			<AnimatePresence>
				{connectivity !== "online" && <Rounds round={round} setRound={setRound} />}
			</AnimatePresence>
			<AnimatePresence>
				{connectivity === "offline" && (
					<>
						<Player label="Player 1" value={playerOne} setValue={setPlayerOne} />
						<Player label="Player 2" value={playerTwo} setValue={setPlayerTwo} />
					</>
				)}
			</AnimatePresence>
			{reset && <ResetButton resetValues={resetValues} />}
		</>
	);
}

export default TicTacToeOptions;
