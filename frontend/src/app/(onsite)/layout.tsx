"use client";

import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { TicTacToeProvider } from "./contexts/tictactoeContext";
import { PingPongProvider } from "./contexts/pingpongContext";
import { GameProvider } from "./game/contexts/gameContext";
import Background from "./components/Background";
import ProtectedRoute from "../(auth)/components/ProtectedRoute";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Background />
			<h1 className="fixed top-0 left-60">MainLayout</h1>
			<Header />
			<div>
				<ProtectedRoute>

					<SideBar />
					<GameProvider>
						<TicTacToeProvider>
							<PingPongProvider>
								{children}
							</PingPongProvider>
						</TicTacToeProvider>
					</GameProvider>
					
				</ProtectedRoute>
			</div>
		</div>
	);
}
