"use client";

import "@/app/globals.css";
import Image from "next/image";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { TicTacToeProvider } from "./contexts/tictactoeContext";
import { PingPongProvider } from "./contexts/pingpongContext";
import { GameProvider } from "./game/contexts/gameContext";
import ToasterCenter from "./components/Header/Notification/Toaster/ToasterCenter";
import { NotificationProvider } from "./components/Header/Notification/context/NotifContext";
import { HeaderProvider } from "./components/Header/context/HeaderContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
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
