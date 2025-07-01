import LandingHeader from "@/app/(auth)/deprecatedcomponents/LandingHeader";
import "@/app/globals.css";
import Background from "./components/Background";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<>
		<h1>auth layout</h1>
			<Background type='secondary' />
			<LandingHeader />
			{children}
		</>
	);
}
