'use client';
import Header from "./components/Header";
import "@/app/globals.css";
import { Toaster } from "sonner";
import PublicRoute from "./components/PublicRoute";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<PublicRoute>
			<Toaster position='bottom-right' visibleToasts={1} />
			<h1>AuthLayout</h1>
			<Header />
			{children}
		</PublicRoute>
	);
}
