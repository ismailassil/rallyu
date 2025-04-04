import "../../globals.css";
import Image from "next/image";
import dmSans from "../../fonts/dmSans";

export default function SignUpLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${dmSans.className} antialiased relative`}>
				<div className="absolute top-0 left-0 w-screen h-screen z-[-1]">
					<Image
						src="/signup_background.svg"
						alt="signup_background"
						quality={100}
						fill={true}
						sizes="100vw"
						objectFit="cover"
					/>
				</div>
				{children}
			</body>
		</html>
	);
}
