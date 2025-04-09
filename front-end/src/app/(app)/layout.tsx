import LandingHeader from "@/app/(app)/components/LandingHeader";
import "@/app/globals.css";

export default function SignUpLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<LandingHeader />
			{children}
		</>
	);
}
