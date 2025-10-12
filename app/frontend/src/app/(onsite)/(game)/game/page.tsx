"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "./contexts/gameContext";
import LobbyPanel from "./components/LobbyPanel";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import GameField from "./components/GameField";

export default function Game() {
	const { updateGameState, gameState } = useGame();
	const { loggedInUser, apiClient } = useAuth();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);

				updateGameState({
					url: `/game/room/join/${res.roomId}?userid=${loggedInUser.id}`,
					opponentId: res.opponentId,
					gameStarted: true,
					gameType: res.gameType,
					gameMode: res.gameMode
				})
				router.push(`/${res.roomId}`);
			} catch (err) {
				console.log(`Game Service Error: ${err}`);
			}
		})()
	}, []);

	console.log('gameStarted:', gameState.gameStarted);

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<AnimatePresence mode="wait">
				{!gameState.gameStarted ? (
					<motion.div
						key="lobby"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="flex flex-row w-full h-full gap-4"
					>
						<LobbyPanel />
					</motion.div>
				) : (
					<motion.div
						key="game"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.4 }}
						className="flex flex-row w-full h-full gap-4"
					>
						<GameField />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.main>
	);
}
