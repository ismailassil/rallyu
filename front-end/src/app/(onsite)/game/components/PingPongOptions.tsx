import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Rounds from "./Items/Rounds";
import Player from "./Items/Player";
import Board from "./Items/Board";
import Range from "./Items/Range";
import ResetButton from "./Items/ResetButton";

function PingPongOptions({ connectivity }: { connectivity: number }) {
	const [paddleWidth, setPaddleWidth] = useState(3);
	const [paddleHeight, setPaddleHeight] = useState(6);
	const [ballSize, setBallSize] = useState(4);
	const [boardColor, setBoardColor] = useState(0);
	const [round, setRound] = useState(0);
	const [reset, setReset] = useState(false);
	const [playerOne, setPlayerOne] = useState("");
	const [playerTwo, setPlayerTwo] = useState("");

	function resetValues() {
		setPaddleWidth(3);
		setPaddleHeight(6);
		setBallSize(4);
		setBoardColor(0);
		setRound(0);
	}

	useEffect(() => {
		if (
			(connectivity > 0 &&
				(paddleWidth !== 3 ||
					paddleHeight !== 6 ||
					ballSize !== 4 ||
					round !== 0)) ||
			boardColor !== 0
		) {
			setReset(true);
		} else {
			setReset(false);
		}
	}, [connectivity, paddleWidth, paddleHeight, ballSize, boardColor, round]);

	return (
		<>
			{connectivity > 0 && (
				<>
					<Range
						label="Paddle Width"
						value={paddleWidth}
						setValue={setPaddleWidth}
					/>
					<Range
						label="Paddle Height"
						value={paddleHeight}
						setValue={setPaddleHeight}
					/>
					<Range
						label="Ball Size"
						value={ballSize}
						setValue={setBallSize}
					/>
				</>
			)}
			<Board
				label="Board Color"
				boardColor={boardColor}
				setBoardColor={setBoardColor}
			/>
			<AnimatePresence>
				{connectivity > 0 && (
					<Rounds round={round} setRound={setRound} />
				)}
			</AnimatePresence>
			<AnimatePresence>
				<>
					{connectivity === 2 && (
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
					{reset && <ResetButton resetValues={resetValues} />}
				</>
			</AnimatePresence>
		</>
	);
}

export default PingPongOptions;
