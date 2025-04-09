import LandingHeader from "@/app/(app)/components/LandingHeader";
import "@/app/globals.css";
import Image from "next/image";

export default function SignUpLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// <html lang="en">
		// 	<body className={`${dmSans.className} antialiased relative`}>
		<div>
			<div className="fixed inset-0 -z-1">
				<Image
					src="/signup_background.svg"
					alt="signup_background"
					quality={100}
					fill={true}
					sizes="100vw"
					style={{ objectFit: "cover", backgroundRepeat: "no-repeat" }}
				/>
			</div>
			<LandingHeader />
			{children}
		</div>
		// 	</body>
		// </html>
	);
}
