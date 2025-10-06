'use client';
import Header from "./components/shared/ui/Header";
import "@/app/globals.css";
import PublicRoute from "./components/shared/guards/PublicRoute";
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
