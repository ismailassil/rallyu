import Range from "../../../game/components/Items/Range";
import Board from "../../../game/components/Items/Board";
import Rounds from "../../../game/components/Items/Rounds";
import { useState } from "react";

function PingPongSelection({ connectivity }: { connectivity: number }) {
	const [paddleWidth, setPaddleWidth] = useState(3);
	const [paddleHeight, setPaddleHeight] = useState(6);
	const [ballSize, setBallSize] = useState(4);
	const [boardColor, setBoardColor] = useState<
		"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four"
	>("bg-theme-one");
	const [round, setRound] = useState<5 | 7 | 9>(5);

	return (
		<>
			{connectivity > 0 && (
				<>
					<Range
						className="lg:gap-20"
						label="Paddle Width"
						value={paddleWidth}
						setValue={setPaddleWidth}
					/>
					<Range
						className="lg:gap-20"
						label="Paddle Height"
						value={paddleHeight}
						setValue={setPaddleHeight}
					/>
					<Range
						className="lg:gap-20"
						label="Ball Size"
						value={ballSize}
						setValue={setBallSize}
					/>
				</>
			)}
			<Board
				label={"Default board color"}
				boardColor={boardColor}
				setBoardColor={setBoardColor}
				className="lg:gap-20"
			/>
			{connectivity > 0 && (
				<>
					<Rounds className="lg:gap-20" round={round} setRound={setRound} />
				</>
			)}
		</>
	);
}

export default PingPongSelection;
