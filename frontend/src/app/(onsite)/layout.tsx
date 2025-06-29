"use client";

import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { TicTacToeProvider } from "./contexts/tictactoeContext";
import { PingPongProvider } from "./contexts/pingpongContext";
import { GameProvider } from "./game/contexts/gameContext";
import Background from "./components/Background";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Background />
			<Header />
			<div>
				<SideBar />
				<GameProvider>
					<TicTacToeProvider>
						<PingPongProvider>{children}</PingPongProvider>
					</TicTacToeProvider>
				</GameProvider>
			</div>
		</div>
	);
}
