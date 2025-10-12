import { useGame } from "../../../contexts/gameContext";
import Pong from "./pong/Pong";
import TicTacToe from "./tictactoe/TicTacToe";
import VersusCard from "../VersusCard";
import SocketProxy from "./utils/socketProxy";
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
		<div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
			{/* <PlayerCard img="" name="" side="left"/> */}
			<VersusCard />
			{/* here we should flip between pong and tictactoe */}
			<div className="flex min-h-0 w-full flex-1 items-center justify-center">
				{gameState.gameType === "pingpong" ? <Pong socketProxy={socketProxy.current} /> : <TicTacToe socketProxy={socketProxy.current} />}
			</div>
		</div>
	);
};

export default GameField;
