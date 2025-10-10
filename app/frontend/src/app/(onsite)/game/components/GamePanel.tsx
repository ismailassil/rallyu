import { AnimatePresence } from "framer-motion";
import LobbyCard from "./Items/LobbyCard";
import GameField from "./Items/games/GameField";
import { useGame } from "../contexts/gameContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import useAPICall from "@/app/hooks/useAPICall";
import { simulateBackendCall } from "@/app/(api)/utils";
import Ping from "./Ping";
import Pong from "./Pong";
import X from "./X";
import O from "./O";

function GamePanel() {
	const [isSearching, setIsSearching] = useState(false);
	const { gameType, setUrl, setOpponentId, gameStarted } = useGame();
	const [queueTime, setQueueTime] = useState(0);
	const { apiClient, loggedInUser, isBusy, setIsBusy } = useAuth();
	const wsRef = useRef<WebSocket | null>(null);


	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (!loggedInUser)
			return; // implement error notif pop up here
		if (isSearching) {
			interval = setInterval(() => {
				setQueueTime(t => t + 1);
			}, 1000);

			const ws = apiClient.connectWebSocket(`/v1/matchmaking/${gameType}/join`);
			wsRef.current = ws;
	
			ws.onopen = () => {
				console.log('WebSocket connected');
				ws.send(JSON.stringify({ id: loggedInUser.id }));
			};
			
			ws.onmessage = (event: MessageEvent) => { // message will be { roomId, opponentId }
				try {
					const data = JSON.parse(event.data);
					setUrl(`/game/room/${data.roomId}?user=${loggedInUser.id}`);
					setOpponentId(data.opponentId);
					setIsSearching(false);
					setIsBusy(false);
					ws.close();
				} catch (err) {
					console.error("Invalid JSON from server: ", err);
				}
			}

			ws.onclose = (event: CloseEvent) => {
				if (event.code === 1001) {
					console.log(event.reason);
					setIsSearching(false);
					setIsBusy(false);
					// display error card to user on web page
				}
			}
		} else if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
			setQueueTime(0);
		}
		return () => {
			if (isBusy)
				setIsBusy(false);
			clearInterval(interval);
		};
	}, [isSearching]);

	useEffect(() => {
		(async () => {
			try {
				if (!loggedInUser)
					return;
				const res = await apiClient.fetchPlayerStatus(loggedInUser.id);

				console.log("result: " ,res);
				setUrl(`/game/room/${res.roomId}?user=${loggedInUser.id}`);
				setOpponentId(res.opponentId)
			} catch (err) {
				console.log(`Game Service: ${err}`);
			}
		})()
	}, []);

	const handleToggleQueue = () => {
		if (isBusy)
			return ;

		setIsBusy(true);
		setIsSearching(!isSearching);
	};

	return (
		<div className="flex flex-row w-full h-full gap-4">
			{/* main */}
			<div className="flex flex-3 w-full h-full gap-4 flex-col">
				{/* top card */}
				<div className="relative rounded-xl w-full h-full">
					<Ping/>
					<Pong/>
					{/* Dashed Line */}
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="12 19"/>
					</svg>
				</div>
				{/* bottom card */}
				<div className="relative rounded-xl w-full h-full">
					<X/>
					<O/>
				</div>
			</div>
			{/* Friends Card */}
			<div className="flex-1 border hidden xl:flex border-br-card bg-card rounded-xl h-full w-full">

			</div>
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
