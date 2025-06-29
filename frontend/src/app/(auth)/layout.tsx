import LandingHeader from "@/app/(auth)/deprecatedcomponents/LandingHeader";
import "@/app/globals.css";
import Background from "./components/Background";

export default function SignUpLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Background type='secondary' />
			<LandingHeader />
			{children}
		</>
	);
}
