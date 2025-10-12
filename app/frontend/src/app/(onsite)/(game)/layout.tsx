"use client";

import { GameProvider } from "./game/contexts/gameContext";

export default function GameLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<GameProvider>
            {children}
        </GameProvider>
	);
}
