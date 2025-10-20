import Ping from "./Items/Ping";
import Pong from "./Items/Pong";
import X from "./Items/X";
import O from "./Items/O";
import useMatchmaking from "@/app/hooks/useMatchMaking";
import { GameType } from "../types/types";

const LobbyPanel = () => {
	const {
		isSearching: pongSearching,
		toggleSearch: togglePongSearch,
		found: pongFound,
		queueTime: pongQueueTime
	} = useMatchmaking('pingpong');
	const {
		isSearching: xoSearching,
		toggleSearch: toggleXOSearch,
		found: xoFound,
		queueTime: xoQueueTime
	} = useMatchmaking('tictactoe');

	const toggleSearch = (gameType: GameType) => {
		if (gameType === 'pingpong') {
			togglePongSearch();
			if (xoSearching) toggleXOSearch();
		} else {
			toggleXOSearch();
			if (pongSearching) togglePongSearch();
		}
	}

	return (
		<>
			<div className="flex flex-6 w-full h-full gap-4 flex-col">
				<div className="relative rounded-xl w-full h-full">
					<Ping handleQueue={toggleSearch} inQueue={pongSearching} found={pongFound} queueTime={pongQueueTime} />
					<Pong />
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="12 19"/>
					</svg>
				</div>
				<div className="relative rounded-xl w-full h-full">
					<X handleQueue={toggleSearch} inQueue={xoSearching} found={xoFound} queueTime={xoQueueTime} />
					<O/>
				</div>
			</div>
		</>
	);
}

export default LobbyPanel;
