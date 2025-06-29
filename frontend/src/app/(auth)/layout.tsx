import LandingHeader from "@/app/(auth)/deprecatedcomponents/LandingHeader";
import "@/app/globals.css";
import Background from "./components/Background";
import AuthProvider from "../(onsite)/contexts/AuthContext";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<AuthProvider>
			<Background type='secondary' />
			<LandingHeader />
			{children}
		</AuthProvider>
	);
}
