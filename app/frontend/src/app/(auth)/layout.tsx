'use client';
import Header from "./components/UI/Header";
import "@/app/globals.css";
import { Toaster } from "sonner";
import PublicRoute from "./components/AuthGuards/PublicRoute";

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
