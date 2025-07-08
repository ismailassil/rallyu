"use client";

import Chart from './Chart';
import { IUserPerformance } from '../../../types';
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import CountUp from "react-countup";
import { Ellipsis } from "lucide-react";
import UserStats from "./UserStats";
import { useState } from "react";

const data = [
	{ date: "2023-01-01", timeSpent: 5 },
	{ date: "2023-01-02", timeSpent: 19 },
	{ date: "2023-01-03", timeSpent: 10 },
	{ date: "2023-01-03", timeSpent: 14 },
	{ date: "2023-01-04", timeSpent: 16 },
	{ date: "2023-01-05", timeSpent: 6 },
	{ date: "2023-01-06", timeSpent: 16 },
	{ date: "2023-01-07", timeSpent: 3 },
];

export default function Performance({ userPerformance } : { userPerformance: IUserPerformance }) {
	const [showDashboard, setShowDashboard] = useState(false);

	// function getStatsByGameType(gameType: string) {
	// 	switch (gameType) {
	// 		case 'ping_pong':
	// 			return {
	// 				games: userPerformance.games.ping_pong.games,
	// 				wins: userPerformance.games.ping_pong.wins,
	// 				losses: userPerformance.games.ping_pong.losses,
	// 				draws: userPerformance.games.ping_pong.draws,
	// 				win_rate: userPerformance.games.ping_pong.win_rate,
	// 				total_points: 18,
	// 				average_score: 9.8,
	// 				playtime: 18
	// 			};
	// 		case 'tic_tac_toe':
	// 			return {
	// 				games: userPerformance.games.tic_tac_toe.games,
	// 				wins: userPerformance.games.tic_tac_toe.wins,
	// 				losses: userPerformance.games.tic_tac_toe.losses,
	// 				draws: userPerformance.games.tic_tac_toe.draws,
	// 				win_rate: userPerformance.games.tic_tac_toe.win_rate,
	// 				total_points: 32,
	// 				average_score: 12.6,
	// 				playtime: 8.7
	// 			};
	// 		default:
	// 			return {
	// 				games: userPerformance.games.games,
	// 				wins: userPerformance.games.wins,
	// 				losses: userPerformance.games.losses,
	// 				draws: userPerformance.games.draws,
	// 				win_rate: userPerformance.win_rate,
	// 				total_points: 18 + 32,
	// 				average_score: 9.8 + 12.6,
	// 				playtime: 18 + 8.7
	// 			};
	// 	}
	// }

	return (
		<div className="flex-3 min-h-130 max-h-220 flex h-full w-full flex-col gap-4">
			<section className={`bg-card border-br-card h-full w-full flex-1 rounded-2xl border-1 select-none`}>
				<div className="flex h-full flex-col">
					<div className="group relative shrink-0 overflow-hidden">
						<h1 className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}>
							Performance
						</h1>
						<div
							className="w-18 h-5 absolute
									left-0 top-[calc(51%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0]
									transition-all duration-200 group-hover:scale-105"
						></div>
					</div>
					<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
						<div className={`pl-8 pr-8 flex h-full flex-col gap-4 pb-4 ${funnelDisplay.className}`}>
							<div
								className="bg-white/4 border border-white/10 hover:scale-101 rounded-2xl pl-4 pr-4 pt-2 pb-2
											flex flex-row items-center justify-between backdrop-blur-xl
											lg:flex-row transition-transform duration-200 hover:bg-white/6"
							>
								<p className="text-2xl text-white/60 font-bold">Total XP</p>
								<p className="text-3xl text-white/80 font-bold">
									<CountUp end={userPerformance.xp} /> XP
								</p>
							</div>
							
							<div className="flex w-full gap-3 text-center">
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
											duration-200
											sm:flex-row sm:justify-between hover:bg-white/6
										"
								>
									<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
										Games
										<span className="inline lg:hidden"> </span>
										<span className="hidden sm:inline"><br /></span>
										Played
									</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={userPerformance.games.games} />
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6
									"
								>
									<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
										Longest
										<span className="inline lg:hidden"> </span>
										<span className="hidden sm:inline"><br /></span>
										Streak
									</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={userPerformance.longest_streak} />
									</p>
								</div>
							</div>


							<div className="flex w-full gap-3 text-center ">
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6"
								>
									<p className="text-lg text-white/60 font-bold">Wins</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={userPerformance.games.wins} />
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6
									"
								>
									<p className="text-lg text-white/60 font-bold">Losses</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={userPerformance.games.losses} />
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between
									"
								>
									<p className="text-lg text-white/60 font-bold">Draws</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={userPerformance.games.draws} />
									</p>
								</div>
							</div>

							<div
								className="jusitfy-between bg-white/4 border border-white/10 min-h-70 hover:scale-101 flex max-h-80
										w-full flex-1 flex-col items-center backdrop-blur-xl
										gap-3 overflow-hidden rounded-2xl pt-5 transition-all duration-200 hover:bg-white/6"
							>
								<p className="text-xl text-white/60 font-bold">Time Spent on Platform</p>
								<div className="relative h-full w-full">
									<Chart data={data} dataKey='timeSpent' unit='Hours'/>
								</div>
							</div>
							<div
								className="bg-white/4 border border-white/10  hover:scale-101 flex
										items-center justify-center backdrop-blur-xl
										gap-3 overflow-hidden rounded-2xl transition-all duration-200 hover:bg-white/6"
							>
								{/* <p className="text-xl text-white/60 font-bold">...</p> */}
								<Ellipsis onClick={() => { setShowDashboard(!showDashboard); } }/>
								{ showDashboard && <UserStats /> }
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
