import { createContext, useContext } from "react";
// import useCountdown from "../../../../hooks/useCountdown";

type XOContextTypes = {
	secondsLeft: number;
	setStart: (value: number) => void;
};

const XOContext = createContext<XOContextTypes | undefined>(undefined);

export function useXO() {
	const context = useContext(XOContext);

	if (context === undefined) {
		throw new Error("useXO must be used within a XOProvider");
	}

	return context;
}

export function XOProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	// const { secondsLeft, setStart } = useCountdown();

	return (
		<XOContext.Provider
			value={{
				secondsLeft,
				setStart,
			}}
		>
			{children}
		</XOContext.Provider>
	);
}
