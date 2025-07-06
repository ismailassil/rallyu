"use client";

import Image from "next/image";
import { IGameHistory } from "../../../types";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

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

	return (
		<div className="bg-white/4 border border-white/10 hover:scale-101 duration-200 hover:bg-hbg hover:border-hbbg relative flex items-center justify-between overflow-hidden rounded-2xl px-5 py-6 transition-all">
			<div
				className={`w-19 h-8 absolute -top-1 left-1/2 flex -translate-x-1/2 items-end justify-center pb-1 ${
					matchResult === 0 ? "bg-gray-600" : matchResult >= 1 ? "bg-green-600" : "bg-red-600"
				} border-1 border-gray-600 rounded-b-lg`}
			>
				<p className="text-sm">
					{matchResult === 0 ? "Draw" : matchResult >= 1 ? "Victory" : "Defeat"}
				</p>
			</div>
			<div className="w-19 bg-gray-thick border border-white/15 absolute -bottom-1 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-t-lg">
				<Image
					src={type === "XO" ? "/icons/XO.svg" : "/icons/ping-pong.svg"}
					width={type === "XO" ? 30 : 18}
					height={type === "XO" ? 30 : 18}
					alt="Profile Image"
				/>
			</div>
			<div className="flex w-[30%] items-center gap-4">
				<div
					className="flex aspect-square h-[40px] w-[40px] items-center
						justify-center rounded-full lg:h-[45px] lg:w-[45px]"
				>
					<Image
						className={`ring-fr-image h-full w-full rounded-full object-cover
							${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score > gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`}
							// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult >= 1 ? "ring-3 ring-green-500" : "ring-2"}`}
						// src={gameInfo.player_home.avatar}
						src={'/profile/image.png'}
						width={100}
						height={100}
						alt="Profile Image"
						// data-tooltip-id={myTooltipId}
						// data-tooltip-content={myName}
						// data-tooltip-place="right"
					/>
					{/* <Tooltip id={myTooltipId} /> */}
				</div>
				<p className="text-wrap truncate">{gameInfo.player_home.username}</p>
			</div>
			<p className="text-xl font-bold">{gameInfo.player_home.score}</p>
			<div className="text-sm italic text-gray-500">{50} XP</div>
			<p className="text-xl font-bold">{gameInfo.player_away.score}</p>
			<div className="flex w-[30%] items-center justify-end gap-4">
				<p className="text-wrap truncate text-right">{gameInfo.player_away.username}</p>
				<div
					className="flex aspect-square h-[40px] w-[40px] items-center
					justify-center rounded-full lg:h-[45px] lg:w-[45px]"
				>
					<Image
						className={`ring-fr-image h-full w-full rounded-full object-cover
						${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score < gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`}
							// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult <= -1 ? "ring-3 ring-green-500" : "ring-2"}`}
						// src={gameInfo.player_away.avatar}
						src={'/profile/image.png'}
						width={100}
						height={100}
						alt="Profile Image"
						// data-tooltip-id={opponentTooltipId}
						// data-tooltip-content={opponent}
						// data-tooltip-place="top"
					/>
					{/* <Tooltip id={opponentTooltipId} /> */}
				</div>
			</div>
		</div>
	);
}

export default Game;
