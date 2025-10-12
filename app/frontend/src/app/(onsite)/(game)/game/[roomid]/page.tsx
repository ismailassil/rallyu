"use client";

import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../contexts/gameContext";
import { useAuth } from "../../../contexts/AuthContext";
import LobbyPanel from "../components/LobbyPanel";
import GameField from "../components/Items/games/GameField";
import { useRouter } from "next/navigation";

export default function Game() {
	const { gameStarted, setUrl, setOpponentId, setGameStarted } = useGame();
	const { apiClient, loggedInUser } = useAuth();
	const params = useParams();
	const router = useRouter();
	const { roomid } = params as { roomid: string};

	useEffect(() => {
		(async () => {
			if (!loggedInUser) return;
			try {
				const res = await apiClient.fetchGameRoomStatus(roomid);

				const opponentId = res.players.find(p => p.ID !== loggedInUser.id)?.ID;
				if (!opponentId){
					router.replace('/not-found');
					return;
				}
				setUrl(`/game/room/join/${roomid}?user=${loggedInUser.id}`);
				setOpponentId(opponentId);
				setGameStarted(true);
			} catch (err) {
				console.log(`Game Service: ${err}`);
				router.replace('/not-found');
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
						: <GameField />
					}
				</div>
			</motion.main>
		</AnimatePresence>
	);
}
