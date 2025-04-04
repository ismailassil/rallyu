import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import dmSans from "./fonts/dmSans";

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
		<html lang="en">
			<body className={`${dmSans.className} antialiased relative`}>
				<div className="absolute top-0 left-0 w-screen h-screen z-[-1]">
					<Image
						src="/background.svg"
						alt="background"
						quality={100}
						fill={true}
						sizes="100vw"
						style={{ objectFit: "cover" }}
					/>
				</div>
				{children}
			</body>
		</html>
	);
}
