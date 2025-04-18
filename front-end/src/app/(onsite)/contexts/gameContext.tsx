import { createContext, useContext, useState } from "react";

type player = {
	img: string;
	name: string;
};

type gameContextTypes = {
	gameType: "pingpong" | "tictactoe";
	setGameType: React.Dispatch<React.SetStateAction<"pingpong" | "tictactoe">>;
	connectivity: "online" | "practice" | "offline";
	setConnectivity: React.Dispatch<React.SetStateAction<"online" | "practice" | "offline">>;
	boardColor: "bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four";
	setBoardColor: React.Dispatch<
		React.SetStateAction<"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four">
	>;
	xColor: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500";
	setXColor: React.Dispatch<
		React.SetStateAction<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500">
	>;
	oColor: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500";
	setOColor: React.Dispatch<
		React.SetStateAction<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500">
	>;
	round: 5 | 7 | 9;
	setRound: React.Dispatch<React.SetStateAction<5 | 7 | 9>>;
	reset: boolean;
	setReset: React.Dispatch<React.SetStateAction<boolean>>;
	paddleWidth: number;
	setPaddleWidth: React.Dispatch<React.SetStateAction<number>>;
	paddleHeight: number;
	setPaddleHeight: React.Dispatch<React.SetStateAction<number>>;
	ballSize: number;
	setBallSize: React.Dispatch<React.SetStateAction<number>>;
	playerOne: player;
	playerTwo: player;
	setPlayerOneName: (value: string) => void;
	setPlayerTwoName: (value: string) => void;
};

const GameContext = createContext<gameContextTypes | undefined>(undefined);

export function useGame() {
	const context = useContext(GameContext);

	if (context === undefined) {
		throw new Error("useGame should be used within GameProvider");
	}

	return context;
}

export function GameProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [gameType, setGameType] = useState<"pingpong" | "tictactoe">("pingpong");
	const [connectivity, setConnectivity] = useState<"online" | "practice" | "offline">("online");
	const [boardColor, setBoardColor] = useState<
		"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four"
	>("bg-theme-one");
	const [xColor, setXColor] = useState<
		"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500"
	>("bg-red-700");
	const [oColor, setOColor] = useState<
		"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-cyan-500"
	>("bg-yellow-500");
	const [round, setRound] = useState<5 | 7 | 9>(5);
	const [reset, setReset] = useState(false);
	const [playerOne, setPlayerOne] = useState<player>({
		img: "/profile/darthVader.jpeg",
		name: "",
	});
	const [playerTwo, setPlayerTwo] = useState<player>({
		img: "/profile/lordVoldemort.jpeg",
		name: "",
	});
	const [paddleWidth, setPaddleWidth] = useState(3);
	const [paddleHeight, setPaddleHeight] = useState(6);
	const [ballSize, setBallSize] = useState(4);

	function setPlayerOneName(value: string) {
		setPlayerOne({ ...playerOne, name: value });
	}

	function setPlayerTwoName(value: string) {
		setPlayerTwo({ ...playerTwo, name: value });
	}

	return (
		<GameContext.Provider
			value={{
				gameType,
				setGameType,
				connectivity,
				paddleWidth,
				setPaddleWidth,
				paddleHeight,
				setPaddleHeight,
				ballSize,
				setBallSize,
				setConnectivity,
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
				playerTwo,
				setPlayerOneName,
				setPlayerTwoName,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
