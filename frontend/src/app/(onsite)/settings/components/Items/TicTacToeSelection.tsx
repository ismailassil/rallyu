import Board from "@/app/(onsite)/game/components/Items/Board";
import Colors from "@/app/(onsite)/game/components/Items/Colors";
import Rounds from "@/app/(onsite)/game/components/Items/Rounds";
import { Circle, X } from "@phosphor-icons/react";
import { useState } from "react";

function TicTacToeSelection({ connectivity }: { connectivity: number }) {
	const [xColor, setXColor] = useState<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">(
		"bg-red-700"
	);
	const [oColor, setOColor] = useState<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">(
		"bg-yellow-500"
	);
	const [boardColor, setBoardColor] = useState<
		"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four"
	>("bg-theme-one");
	const [round, setRound] = useState<5 | 7 | 9>(5);

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
				className="lg:gap-20"
				handleSet={handleSet}
				setColor={setXColor}
				Color={oColor}
				innerColor={xColor}
				label={"Color"}
			>
				<X size={28} weight="bold" />
			</Colors>
			<Colors
				className="lg:gap-20"
				handleSet={handleSet}
				setColor={setOColor}
				Color={xColor}
				innerColor={oColor}
				label={"Color"}
			>
				<Circle size={28} weight="bold" />
			</Colors>
			<Board
				className="lg:gap-20"
				label="Board Color"
				boardColor={boardColor}
				setBoardColor={setBoardColor}
			/>
			{connectivity > 0 && <Rounds className="lg:gap-20" round={round} setRound={setRound} />}
		</>
	);
}

export default TicTacToeSelection;
