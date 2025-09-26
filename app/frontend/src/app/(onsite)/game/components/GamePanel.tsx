import { AnimatePresence } from "framer-motion";
import LobbyCard from "./Items/LobbyCard";
import GameField from "./Items/GameField";
import { useGame } from "../contexts/gameContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

function GamePanel() {
	const { apiClient, loggedInUser } = useAuth();
	const { setUrl } = useGame();

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);

				setUrl(`/game/room/${res.roomId}?user=${loggedInUser.id}`);
			} catch (err) {
				console.log(`Game Service: ${err}`);
			}
		})()
	}, [])

	return (
		<div className="flex w-full gap-4 flex-col lg:flex-row">
			<AnimatePresence>
				<div className="flex flex-col justify-center items-center basis-2/3 w-full border border-white/15 bg-card rounded-md">
					<GameField />
				</div>
			</AnimatePresence>
			<AnimatePresence>
				<div className="flex basis-1/3 flex-col hide-scrollbar max-h-200 lg:max-h-full bg-card border border-white/15 rounded-md w-full">
					<LobbyCard /> {/* switch between lobby and chat*/}
				</div>
			</AnimatePresence>
		</div>
	);
}

export default GamePanel;
