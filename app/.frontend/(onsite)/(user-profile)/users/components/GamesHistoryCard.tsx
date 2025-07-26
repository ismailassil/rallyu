/* eslint-disable @typescript-eslint/no-unused-vars */
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import Image from "next/image";

type GameProps = {
	match_id: number,
    game_type: string,
    started_at: string,
    finished_at: string,
    user_id: number,
    user_username: string,
    user_score: number,
    opp_score: number,
    opponent_id: number,
    opponent_username: string,
    duration: number,
    outcome: string
}

function Game({ 
		match_id, 
		game_type, 
		started_at, 
		finished_at, 
		user_id, 
		user_username, 
		user_score, 
		opp_score, 
		opponent_id, 
		opponent_username, 
		duration, 
		outcome 
	} : GameProps) {

	return (
		<div className="bg-white/4 border border-white/10 hover:scale-101 duration-200 hover:bg-hbg hover:border-hbbg relative flex items-center justify-between overflow-hidden rounded-2xl px-5 py-6 transition-all">
			<div
				className={`w-19 h-8 absolute -top-1 left-1/2 flex -translate-x-1/2 items-end justify-center pb-1 ${
					outcome === 'W' ? "bg-green-600" : outcome === 'L' ? "bg-red-600" : "bg-gray-600"
				} border-1 border-gray-600 rounded-b-lg`}
			>
				<p className="text-sm">
					{outcome === 'W' ? 'Victory' : outcome === 'L' ? 'Defeat' : 'Draw'}
				</p>
			</div>
			<div className="w-19 bg-gray-thick border border-white/15 absolute -bottom-1 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-t-lg">
				<Image
					src={game_type === "XO" ? "/icons/XO.svg" : "/icons/ping-pong.svg"}
					width={game_type === "XO" ? 30 : 18}
					height={game_type === "XO" ? 30 : 18}
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
							${outcome === 'W' ? 'ring-3 ring-green-500' : outcome === 'L' ? 'ring-3 ring-red-500' : 'ring-3 ring-gray-500'}`}
							// ${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score > gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`
							// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult >= 1 ? "ring-3 ring-green-500" : "ring-2"}`}
						// src={gameInfo.player_home.avatar}
						src={'/profile/image.png'}
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
				<p className="text-wrap truncate">{user_username}</p>
			</div>
			<p className="text-xl font-bold">{user_score}</p>
			<div className="text-sm italic text-gray-500">{50} XP</div>
			<p className="text-xl font-bold">{opp_score}</p>
			<div className="flex w-[30%] items-center justify-end gap-4">
				<p className="text-wrap truncate text-right">{opponent_username}</p>
				<div
					className="flex aspect-square h-[40px] w-[40px] items-center
					justify-center rounded-full lg:h-[45px] lg:w-[45px]"
				>
					<Image
						className={`ring-fr-image h-full w-full rounded-full object-cover
							${outcome === 'W' ? 'ring-3 ring-red-500' : outcome === 'L' ? 'ring-3 ring-green-500' : 'ring-3 ring-gray-500'}`}
						// ${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score < gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`}
							// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult <= -1 ? "ring-3 ring-green-500" : "ring-2"}`}
						// src={gameInfo.player_away.avatar}
						src={'/profile/image.png'}
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
			</div>
		</div>
	);
}

export default function GamesHistoryCard({ matches } : { matches: GameProps[] }) {
	return (
		<aside
			className={`bg-card border-br-card min-h-130 max-h-220 h-full w-full min-w-[30%] flex-[2.5] rounded-2xl border-1 select-none`}
		>
			<div className="flex h-full flex-col">
				<div className="group relative shrink-0 overflow-hidden">
					<h1 className={`text-blue-500 ${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}>
							Games History
					</h1>
					<div
						className="w-18 h-5 absolute
								left-0 top-[calc(51%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500
								transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
				<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
					<div className="flex flex-col gap-y-2.5 pl-4 pr-4">
						{/* {Array.from({ length: 10 }).map((_, i) => (
							<Game
								key={i}
								opponent="Nabil Azouz"
								myName="Ismail Assil"
								type={i % 2 ? "xo" : undefined}
								score={{
									me: i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 5,
									opponent: i % 3 === 0 ? 2 : i % 3 === 1 ? 5 : 5,
								}}
								opponentImage="/profile/image_1.jpg"
								myImage="/profile/image.png"
								matchxp={i % 3 === 0 ? 0 : i % 2 ? -50 : 100}
							/>
						))} */}
						{matches.map((match) => (
							<Game
								key={match.match_id}
								match_id={match.match_id}
								game_type={match.game_type}
								started_at={match.started_at}
								finished_at={match.finished_at}
								user_id={match.user_id}
								user_username={match.user_username}
								user_score={match.user_score}
								opp_score={match.opp_score}
								opponent_id={match.opponent_id}
								opponent_username={match.opponent_username}
								duration={match.duration}
								outcome={match.outcome}
							/>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
