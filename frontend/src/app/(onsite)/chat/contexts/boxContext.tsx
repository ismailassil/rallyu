import { createContext, useContext, useState } from "react";
import useIsWidth from "../../../hooks/useIsWidth";

type BoxContextType = {
	isWidth: boolean;
	showbox: boolean;
	setShowbox: (value: boolean) => void;
	userMessage: boolean;
	setUserMessage: (value: boolean) => void;
	selectedFriend: number | null;
	setSelectedFriend: (value: number | null) => void;
};

// Create the context
const BoxContext = createContext<BoxContextType | undefined>(undefined);

// Custom hook to use the Context
export function useBox() {
	const context = useContext(BoxContext);

	if (context === undefined) {
		throw new Error("useBox must be used within a BoxProvider");
	}

	return context;
}

// Provider Component
export function BoxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const isWidth = useIsWidth(1024);
	const [showbox, setShowbox] = useState(false);
	const [userMessage, setUserMessage] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<number | null>(null);

	return (
		<BoxContext.Provider
			value={{
				isWidth,
				showbox,
				userMessage,
				selectedFriend,
				setShowbox,
				setUserMessage,
				setSelectedFriend,
			}}
		>
			{children}
		</BoxContext.Provider>
	);
}
