import { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";

interface HeaderContextTypes {
	isSearch: boolean;
	setIsSearch: Dispatch<SetStateAction<boolean>>;
	isProfile: boolean;
	setIsProfile: Dispatch<SetStateAction<boolean>>;
	isNotif: boolean;
	setIsNotif: Dispatch<SetStateAction<boolean>>;
	profileRef: RefObject<HTMLDivElement | null>;
	notificationRef: RefObject<HTMLDivElement | null>;
	isBottom: boolean;
	setIsBottom: Dispatch<SetStateAction<boolean>>;
}

export const HeaderContext = createContext<HeaderContextTypes | undefined>(undefined);

export function useHeaderContext() {
	const context = useContext(HeaderContext);

	if (context === undefined) {
		throw new Error("useHeaderContext must be used within a HeaderProvider");
	}

	return context;
}

export function HeaderProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [isSearch, setIsSearch] = useState(false);
	const [isProfile, setIsProfile] = useState(false);
	const [isNotif, setIsNotif] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);
	const [isBottom, setIsBottom] = useState(false);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node)
			) {
				setIsNotif((isNotif) => !isNotif);
			}
		}

		if (isNotif) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isNotif]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfile((isProfile) => !isProfile);
			}
		}

		if (isProfile) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isProfile]);

	return (
		<HeaderContext.Provider
			value={{
				isSearch,
				setIsSearch,
				isProfile,
				setIsProfile,
				isNotif,
				setIsNotif,
				profileRef,
				notificationRef,
				isBottom,
				setIsBottom,
			}}
		>
			{children}
		</HeaderContext.Provider>
	);
}
