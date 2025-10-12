import { useGame } from "../contexts/gameContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LobbyPanel from "./LobbyPanel";

function GamePanel() {
	const { loggedInUser, apiClient } = useAuth();
	const { setUrl, setOpponentId, gameStarted } = useGame();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);

				setUrl(`/game/room/join/${res.roomId}?user=${loggedInUser.id}`);
				setOpponentId(res.opponentId)
				router.push(`/${res.roomId}`);
			} catch (err) {
				console.log(`Game Service: ${err}`);
			}
		})()
	}, []);

	return (
		<div className="flex flex-row w-full h-full gap-4">
			{gameStarted
				? <LobbyPanel />
				: <></>
			}
		</div>
	);
}
			// <AnimatePresence>
			// 	<div className={`flex flex-col justify-center items-center w-full rounded-md bg-card border border-white/15 p-4 min-w-0 transition-all duration-500 ease-in-out ${!gameStarted ? '2xl:flex-3 flex-5' : 'flex-1'} `}>
			// 		<GameField />
			// 	</div>
			// </AnimatePresence>
			// <AnimatePresence>
			// 	<div className={`flex  flex-col hide-scrollbar lg:max-h-full bg-card border border-white/15 rounded-md w-full overflow-hidden
			// 			transition-all duration-500 ease-in-out
			// 		${!gameStarted
			// 			? '2xl:flex-1 flex-4 opacity-100'
			// 			: 'flex-0 opacity-0 scale-x-0 translate-x-full'
			// 		}
			// 		w-full`}>
			// 		<LobbyCard /> {/* switch between lobby and chat*/}
			// 	</div>
			// </AnimatePresence>

export default GamePanel;
