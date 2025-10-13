"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GameProvider } from "./contexts/gameContext";
import LobbyPanel from "./components/LobbyPanel";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Game() {
	const { loggedInUser, apiClient } = useAuth();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);
				router.push(`/game/${res.gameType}/${res.roomId}?opponent=${res.opponentId}`);
			} catch (err) {
				console.log(`Game Service Error: ${err}`);
			}
		})()
	}, []);

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<AnimatePresence mode="wait">
				<motion.div
					key="lobby"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 30 }}
					transition={{ duration: 0.4 }}
					className="flex flex-row w-full h-full gap-4"
				>
					<GameProvider>
						<LobbyPanel />
					</GameProvider>
				</motion.div>
			</AnimatePresence>
		</motion.main>
	);
}
