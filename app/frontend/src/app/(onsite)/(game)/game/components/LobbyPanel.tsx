import { useGame } from "../contexts/gameContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useRef, useState } from "react";
import Ping from "./Ping";
import Pong from "./Pong";
import X from "./X";
import O from "./O";

const LobbyPanel = () => {
	const [isSearching, setIsSearching] = useState(false);
	const { gameType, setUrl, setOpponentId, gameStarted } = useGame();
	const { apiClient, loggedInUser, isBusy, setIsBusy } = useAuth();
	const wsRef = useRef<WebSocket | null>(null);

	const handleToggleQueue = () => {
		if (isBusy || !loggedInUser)
			return ;

		const newIsSearching = !isSearching;
		setIsBusy(true);
		setIsSearching(!isSearching);
		if (newIsSearching) {
            console.log('Querying matchmaking')
			const ws = apiClient.connectWebSocket(`/v1/matchmaking/${gameType}/join`);
			wsRef.current = ws;

			ws.onopen = () => {
				console.log('Matchmaking WebSocket connected');
                ws.send(JSON.stringify({ id: loggedInUser.id }));
			};

			ws.onmessage = (event: MessageEvent) => { // message will be { roomId, opponentId }
				try {
					const data = JSON.parse(event.data);
					setUrl(`/game/room/join/${data.roomId}?user=${loggedInUser.id}`);
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
				}
			}
		} else if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}
	};

	return (
		<>
			<div className="flex flex-3 w-full h-full gap-4 flex-col">
				<div className="relative rounded-xl w-full h-full">
					<Ping onClick={handleToggleQueue} />
					<Pong/>
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="12 19"/>
					</svg>
				</div>
				<div className="relative rounded-xl w-full h-full">
					<X/>
					<O/>
				</div>
			</div>
			<div className="flex-1 border hidden xl:flex border-br-card bg-card rounded-xl h-full w-full">

			</div>
		</>
	);
}

export default LobbyPanel;
