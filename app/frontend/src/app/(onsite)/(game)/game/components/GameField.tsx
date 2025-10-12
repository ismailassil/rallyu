import { useGame } from "../contexts/gameContext";
import Pong from "./Items/games/pong/Pong";
import TicTacToe from "./Items/games/tictactoe/TicTacToe";
import VersusCard from "./Items/VersusCard";
import SocketProxy from "./Items/games/utils/socketProxy";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

const GameField = () => {
	const { apiClient } = useAuth();
	const { gameState, updateGameState } = useGame();
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());

	useEffect(() => {
		try {
			if (!gameState.url)
				return ;
			const disconnect = socketProxy.current.connect(gameState.url, apiClient, updateGameState);
			return disconnect;
		}
		catch (err) {
			console.error('Unable to connect to game server: ', err);
		}
	}, [gameState.url])

	return (
		<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
			<div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
			{/* <PlayerCard img="" name="" side="left"/> */}
			<VersusCard />
			{/* here we should flip between pong and tictactoe */}
			<div className="flex min-h-0 w-full flex-1 items-center justify-center">
				{gameState.gameType === "pingpong" ? <Pong socketProxy={socketProxy.current} /> : <TicTacToe socketProxy={socketProxy.current} />}
			</div>
		</div>
		</article>
	);
};

export default GameField;
