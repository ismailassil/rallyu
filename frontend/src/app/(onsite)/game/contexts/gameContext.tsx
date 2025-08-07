import { createContext, Dispatch, RefObject, SetStateAction, useContext, useRef, useState } from "react";

type gameTypes = {
	gameType: "pingpong" | "tictactoe";
	setGameType: Dispatch<SetStateAction<"pingpong" | "tictactoe">>;
	launch: boolean;
	setLaunch: Dispatch<SetStateAction<boolean>>;
	ws: RefObject<WebSocket | null>;
	matchFound: boolean;
	setMatchFound: Dispatch<SetStateAction<boolean>>;
};

const GameContext = createContext<gameTypes | undefined>(undefined);

export function useGameContext() {
	const context = useContext(GameContext);

	if (context === undefined) {
		throw new Error("useGame must be used within GameProvider");
	}

	return context;
}

export function GameProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [gameType, setGameType] = useState<"pingpong" | "tictactoe">("pingpong");
	const [launch, setLaunch] = useState<boolean>(false);
	const [matchFound, setMatchFound] = useState<boolean>(false);
	const ws = useRef<WebSocket | null>(null);

	return (
		<GameContext.Provider
			value={{
				gameType,
				setGameType,
				launch,
				setLaunch,
				ws,
				matchFound,
				setMatchFound,
			}}
		>
			{children}
		</GameContext.Provider>
	);
}
