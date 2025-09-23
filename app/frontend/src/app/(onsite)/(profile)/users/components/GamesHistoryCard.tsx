/* eslint-disable @typescript-eslint/no-unused-vars */
import MainCardWithHeader from "@/app/(onsite)/(refactoredUIComponents)/MainCardWithHeader";
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import Image from "next/image";

type GameProps = {
	match_id: number,
    game_type: string,
    started_at: string,
    finished_at: string,
    user_id: number,
    user_username: string,
	user_avatar_path: string,
    user_score: number,
    opp_score: number,
    opponent_id: number,
    opponent_username: string,
	opponent_avatar_path: string,
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
		user_avatar_path,
		user_score, 
		opp_score, 
		opponent_id, 
		opponent_username, 
		opponent_avatar_path,
		duration, 
		outcome 
	} : GameProps) {

	return (
		<div className="single-game-history-card relative overflow-hidden">
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
						src={`http://localhost:4025/api/users${user_avatar_path}`}
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
						src={`http://localhost:4025/api/users${opponent_avatar_path}`}
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
	if (matches.length === 0) {
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
				<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto flex justify-center items-center">
					<div className="flex flex-col gap-y-2.5 pl-4 pr-4 justify-center items-center">
						<Image
							src={'/meme/sad.png'}
							width={150}
							height={150}
							alt="No data available"
							className="rounded-2xl  blur-[0.75px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
							draggable={false}
							>
						</Image>
						<h1 className="text-white/60">No data available</h1>
					</div>
				</div>
			</div>
		</aside>
		);
	}

	return (
		<MainCardWithHeader headerName='Games History' className='font-funnel-display flex-3'>
			<div className="group flex flex-col gap-4 px-6">
				{matches.map((match) => (
					<Game
						key={match.match_id}
						match_id={match.match_id}
						game_type={match.game_type}
						started_at={match.started_at}
						finished_at={match.finished_at}
						user_id={match.user_id}
						user_username={match.user_username}
						user_avatar_path={match.user_avatar_path}
						user_score={match.user_score}
						opp_score={match.opp_score}
						opponent_id={match.opponent_id}
						opponent_username={match.opponent_username}
						opponent_avatar_path={match.opponent_avatar_path}
						duration={match.duration}
						outcome={match.outcome}
					/>
				))}
			</div>
		</MainCardWithHeader>
	);

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
						{matches.map((match) => (
							<Game
								key={match.match_id}
								match_id={match.match_id}
								game_type={match.game_type}
								started_at={match.started_at}
								finished_at={match.finished_at}
								user_id={match.user_id}
								user_username={match.user_username}
								user_avatar_path={match.user_avatar_path}
								user_score={match.user_score}
								opp_score={match.opp_score}
								opponent_id={match.opponent_id}
								opponent_username={match.opponent_username}
								opponent_avatar_path={match.opponent_avatar_path}
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
