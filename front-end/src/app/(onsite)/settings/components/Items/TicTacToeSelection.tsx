import Board from "@/app/(onsite)/game/components/Items/Board";
import Colors from "@/app/(onsite)/game/components/Items/Colors";
import Rounds from "@/app/(onsite)/game/components/Items/Rounds";
import { Circle, X } from "@phosphor-icons/react";
import { useState } from "react";

function TicTacToeSelection({ connectivity }: { connectivity: number }) {
	const [xColor, setXColor] = useState(0);
	const [oColor, setOColor] = useState(1);
	const [boardColor, setBoardColor] = useState(0);
	const [round, setRound] = useState(0);

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
			{connectivity > 0 && (
				<Rounds
					className="lg:gap-20"
					round={round}
					setRound={setRound}
				/>
			)}
		</>
	);
}

export default TicTacToeSelection;
