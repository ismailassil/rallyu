"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "./contexts/gameContext";
import LobbyPanel from "./components/LobbyPanel";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import GameField from "./components/Items/games/GameField";

export default function Game() {
	const { gameStarted, setUrl, setOpponentId, setGameStarted } = useGame();
	const { loggedInUser, apiClient } = useAuth();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);

				setUrl(`/game/room/join/${res.roomId}?user=${loggedInUser.id}`);
				setOpponentId(res.opponentId)
				setGameStarted(true);
				router.push(`/${res.roomId}`);
			} catch (err) {
				console.log(`Game Service: ${err}`);
			}
		})()
	}, []);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
			>
				<div className="flex flex-row w-full h-full gap-4">
					{!gameStarted
						? <LobbyPanel />
						: <GameField/>
					}
				</div>
			</motion.main>
		</AnimatePresence>
	);
}
