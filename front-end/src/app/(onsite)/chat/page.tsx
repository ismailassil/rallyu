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
			className="h-[100vh] pt-30 pl-6 sm:pl-30 pr-6 pb-24 sm:pb-6"
		>
			<div className="h-full w-full rounded-md flex gap-6">
				<article
					className="h-full w-full flex gap-6 flex-5 bg-card rounded-2xl border-2
						border-br-card p-4 pl-3"
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
