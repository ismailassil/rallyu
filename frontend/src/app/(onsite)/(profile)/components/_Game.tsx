"use client";

import Image from "next/image";
import { IGameHistory } from "../users/[username]/page";
import { useAuth } from "../../contexts/AuthContext";
// import { Tooltip } from "react-tooltip";

// function Game({
// 	type = "pingpong",
// 	opponent,
// 	myName,
// 	score,
// 	myImage,
// 	opponentImage,
// 	matchxp,
// } : {
// 	type?: "pingpong" | "xo";
// 	myName: string;
// 	opponent: string;
// 	score: { me: number; opponent: number };
// 	opponentImage: string;
// 	myImage: string;
// 	matchxp: number;
// }) {
function Game({ gameInfo } : { gameInfo: IGameHistory }) {
	const { user } = useAuth();
	const username = user!.username;

	let usr;
	let opp;
	if (username === gameInfo.player_home.username) {
		usr = gameInfo.player_home;
		opp = gameInfo.player_away;
	} else {
		usr = gameInfo.player_away;
		opp = gameInfo.player_home;
	}
	const type = gameInfo.game_type === 'PING PONG' ? 'PING PONG' : gameInfo.game_type === 'TICTACTOE' ? 'XO' : '';
	const matchResult = usr.score > opp.score ? 1 : usr.score < opp.score ? -1 : 0;
	console.log('myScore: ', usr.score, 'oppScore: ', opp.score);
	console.log('matchResult: ', matchResult);

	//bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30
	return (
		<div className="w-full max-w-2xl mx-auto">
			<div className="relative overflow-hidden rounded-2xl border-1 backdrop-blur-2xl
							bg-child-card border-child-card-border
							hover:scale-[1.01] hover:shadow-lg transition-all duration-300
							p-6">
				<div className="pt-2 pb-2">
					<div className="flex items-center justify-between">
						<div className="flex flex-col items-center gap-3 flex-1">
							<div className="relative">
								<div className="
										w-12 h-12 rounded-full border-3 overflow-hidden shadow-lg
										border-green-400
										sm:w-16 sm:h-16
									">
									<Image
										className="w-full h-full object-cover"
										src={'/profile/image.png'}
										width={100}
										height={100}
										alt="Profile Image"
									/>
								</div>
							</div>
							<div className="text-center">
								<p className="font-bold text-white text-lg truncate max-w-24 sm:max-w-32">xezzuz</p>
							</div>
						</div>
						<div className="flex flex-col items-center gap-3 flex-1">

						</div>
						<div className="flex flex-col items-center gap-3 flex-1">

						</div>
					</div>
				</div>
				{/* <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"></div> */}
			</div>
		</div>
	);
}

export default Game;
