import LandingHeader from "@/app/(auth)/deprecatedcomponents/LandingHeader";
import "@/app/globals.css";
import Background from "./components/Background";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<>
			<Toaster position='bottom-right' visibleToasts={1}/>
			<h1>auth layout</h1>
			<Background type='secondary' />
			<LandingHeader />
			{children}
		</>
	);
}
