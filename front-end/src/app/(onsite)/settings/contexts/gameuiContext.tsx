import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function useGameUiContext() {
	const context = useContext(GameContext);

	if (context === undefined) {
		throw new Error("gameUI should be used within GameUIProvider");
	}

	return context;
}

export function GameUiProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [game, setGame] = useState(0);
	const [connectivity, setConnectivity] = useState(0);

	return (
		<GameContext.Provider value={(game, setGame, connectivity, setConnectivity)}>
			{children}
		</GameContext.Provider>
	);
}
