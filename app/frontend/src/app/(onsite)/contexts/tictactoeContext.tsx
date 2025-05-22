import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type player = {
	img: string;
	name: string;
};

type contextTypes = {
	gameType: "pingpong" | "tictactoe";
	setGameType: React.Dispatch<React.SetStateAction<"pingpong" | "tictactoe">>;
	connectivity: "online" | "practice" | "offline";
	setConnectivity: React.Dispatch<React.SetStateAction<"online" | "practice" | "offline">>;
	boardColor: "bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four";
	setBoardColor: React.Dispatch<
		React.SetStateAction<"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four">
	>;
	xColor: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500";
	setXColor: React.Dispatch<
		React.SetStateAction<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">
	>;
	oColor: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500";
	setOColor: React.Dispatch<
		React.SetStateAction<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">
	>;
	round: 5 | 7 | 9;
	setRound: React.Dispatch<React.SetStateAction<5 | 7 | 9>>;
	reset: boolean;
	setReset: React.Dispatch<React.SetStateAction<boolean>>;
	playerOne: string;
	playerTwo: string;
	setPlayerOne: Dispatch<SetStateAction<string>>;
	setPlayerTwo: Dispatch<SetStateAction<string>>;
	players: {
		playerOne: player;
		playerTwo: player;
	};
	setPlayers: Dispatch<
		SetStateAction<{
			playerOne: player;
			playerTwo: player;
		}>
	>;
};

const TicTacToeContext = createContext<contextTypes | undefined>(undefined);

export function useTicTacToe() {
	const context = useContext(TicTacToeContext);

	if (context === undefined) {
		throw new Error("useGame should be used within TicTacToeProvider");
	}

	return context;
}

export function TicTacToeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [gameType, setGameType] = useState<"pingpong" | "tictactoe">("pingpong");
	const [connectivity, setConnectivity] = useState<"online" | "practice" | "offline">("online");
	const [boardColor, setBoardColor] = useState<
		"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four"
	>("bg-theme-one");
	const [xColor, setXColor] = useState<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">(
		"bg-red-700"
	);
	const [oColor, setOColor] = useState<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">(
		"bg-yellow-500"
	);
	const [round, setRound] = useState<5 | 7 | 9>(5);
	const [reset, setReset] = useState(false);
	const [playerOne, setPlayerOne] = useState<string>("");
	const [playerTwo, setPlayerTwo] = useState<string>("");
	const [players, setPlayers] = useState({
		playerOne: { img: "", name: "" },
		playerTwo: { img: "", name: "" },
	});

	return (
		<TicTacToeContext.Provider
			value={{
				gameType,
				setGameType,
				connectivity,
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
				setPlayerOne,
				setPlayerTwo,
				players,
				setPlayers,
			}}
		>
			{children}
		</TicTacToeContext.Provider>
	);
}
