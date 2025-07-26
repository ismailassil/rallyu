"use client";

import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { TicTacToeProvider } from "./contexts/tictactoeContext";
import { PingPongProvider } from "./contexts/pingpongContext";
import { GameProvider } from "./game/contexts/gameContext";
<<<<<<< HEAD:frontend/src/app/(onsite)/layout.tsx
import Background from "./components/Background";
import ProtectedRoute from "../(auth)/components/ProtectedRoute";
=======
import ToasterCenter from "./components/Header/Notification/Toaster/ToasterCenter";
import { NotificationProvider } from "./components/Header/Notification/context/NotifContext";
import { HeaderProvider } from "./components/Header/context/HeaderContext";
>>>>>>> origin/dev-elk:app/.frontend/src/app/(onsite)/layout.tsx

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
<<<<<<< HEAD:frontend/src/app/(onsite)/layout.tsx
			<Background />
			<h1 className="fixed top-0 left-60">MainLayout</h1>
			<Header />
=======
			<div className="-z-1 fixed inset-0">
				<Image
					src="/background/main/background.svg"
					alt="background"
					quality={100}
					fill={true}
					sizes="100vw"
					style={{ objectFit: "cover" }}
				/>
			</div>
			<HeaderProvider>
				<NotificationProvider>
					<Header />
					<ToasterCenter />
				</NotificationProvider>
			</HeaderProvider>
>>>>>>> origin/dev-elk:app/.frontend/src/app/(onsite)/layout.tsx
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
