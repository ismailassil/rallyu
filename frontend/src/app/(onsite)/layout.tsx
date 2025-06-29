"use client";

import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { TicTacToeProvider } from "./contexts/tictactoeContext";
import { PingPongProvider } from "./contexts/pingpongContext";
import { GameProvider } from "./game/contexts/gameContext";
import Background from "./components/Background";
import AuthProvider from "./contexts/AuthContext";

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
				<AuthProvider>
					<SideBar />
					<GameProvider>
						<TicTacToeProvider>
							<PingPongProvider>{children}</PingPongProvider>
						</TicTacToeProvider>
					</GameProvider>
				</AuthProvider>
			</div>
		</div>
	);
}
