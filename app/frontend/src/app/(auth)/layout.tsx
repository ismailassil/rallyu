'use client';
import Header from "./components/UI/Header";
import "@/app/globals.css";
import PublicRoute from "./components/AuthGuards/PublicRoute";
import { AnimatePresence } from "framer-motion";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<PublicRoute>
			<div className="absolute inset-0 h-screen w-screen overflow-auto font-funnel-display">
				<Header />
				<AnimatePresence>
					{children}
				</AnimatePresence>
			</div>
		</PublicRoute>
	);
}
