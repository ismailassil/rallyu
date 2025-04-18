import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Rounds from "./Items/Rounds";
import Player from "./Items/Player";
import Board from "./Items/Board";
import Range from "./Items/Range";
import ResetButton from "./Items/ResetButton";
import { useGame } from "../../contexts/gameContext";

function PingPongOptions() {
	const {
		paddleWidth,
		setPaddleWidth,
		paddleHeight,
		setPaddleHeight,
		ballSize,
		setBallSize,
		boardColor,
		setBoardColor,
		round,
		setRound,
		reset,
		setReset,
		playerOne,
		setPlayerOneName,
		playerTwo,
		setPlayerTwoName,
	} = useGame();

	const defaultRound = 5;
	const defaultBoardColor = "bg-theme-one";

	const { connectivity } = useGame();

	function resetValues() {
		setPaddleWidth(3);
		setPaddleHeight(6);
		setBallSize(4);
		setBoardColor(defaultBoardColor);
		setRound(defaultRound);
	}

	useEffect(() => {
		if (
			(connectivity !== "online" &&
				(paddleWidth !== 3 || paddleHeight !== 6 || ballSize !== 4 || round !== defaultRound)) ||
			boardColor !== defaultBoardColor
		) {
			setReset(true);
		} else {
			setReset(false);
		}
	}, [connectivity, paddleWidth, paddleHeight, ballSize, boardColor, round, setReset]);

	return (
		<>
			{connectivity !== "online" && (
				<>
					<Range label="Paddle Width" value={paddleWidth} setValue={setPaddleWidth} />
					<Range label="Paddle Height" value={paddleHeight} setValue={setPaddleHeight} />
					<Range label="Ball Size" value={ballSize} setValue={setBallSize} />
				</>
			)}
			<Board label="Board Color" boardColor={boardColor} setBoardColor={setBoardColor} />
			<AnimatePresence>
				{connectivity !== "online" && <Rounds round={round} setRound={setRound} />}
			</AnimatePresence>
			<AnimatePresence>
				<>
					{connectivity === "offline" && (
						<>
							<Player label="Player 1" value={playerOne.name} setValue={setPlayerOneName} />
							<Player label="Player 2" value={playerTwo.name} setValue={setPlayerTwoName} />
						</>
					)}
					{reset && <ResetButton resetValues={resetValues} />}
				</>
			</AnimatePresence>
		</>
	);
}

export default PingPongOptions;
