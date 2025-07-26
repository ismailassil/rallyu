"use client";

import { motion } from "framer-motion";
import FriendsList from "./components/FriendsList";
import MessageSection from "./components/MessageBox";
import { BoxProvider } from "./contexts/boxContext";

export default function Dashboard() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-md">
				<article
					className="flex-5 bg-card border-br-card flex h-full w-full gap-6 rounded-2xl
						border-2 p-4 pl-3"
				>
					<BoxProvider>
						<FriendsList />
						<MessageSection />
					</BoxProvider>
				</article>
			</div>
		</motion.main>
	);
}
