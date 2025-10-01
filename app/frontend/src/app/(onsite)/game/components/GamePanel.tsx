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
		<div className="flex w-full gap-4 flex-col 2xl:flex-row">
			<AnimatePresence>
				<div className="flex flex-col justify-center items-center w-full border border-white/15 bg-card rounded-md p-4 min-w-0 flex-3">
					<GameField />
				</div>
			</AnimatePresence>
			<AnimatePresence>
				<div className="flex flex-col hide-scrollbar lg:max-h-full bg-card border border-white/15 rounded-md w-full overflow-hidden flex-1 min-w-[300px]">
					<LobbyCard /> {/* switch between lobby and chat*/}
				</div>
			</AnimatePresence>
		</div>
	);
}

export default GamePanel;
