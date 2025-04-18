"use client";

import "@/app/globals.css";
import Image from "next/image";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import { GameProvider } from "./contexts/gameContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<div className="-z-1 fixed inset-0">
				<Image
					src="/background.svg"
					alt="background"
					quality={100}
					fill={true}
					sizes="100vw"
					style={{ objectFit: "cover" }}
				/>
			</div>
			<Header />
			<div>
				<SideBar />
				<GameProvider>{children}</GameProvider>
			</div>
		</div>
	);
}
