import type { Metadata } from "next";
import "@/app/globals.css";
import Image from "next/image";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";

export const metadata: Metadata = {
	title: "Rallyu",
	description: "Play fast-paced online ping pong battles!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<div className="fixed inset-0 -z-1">
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
				{children}
			</div>
		</div>
	);
}
