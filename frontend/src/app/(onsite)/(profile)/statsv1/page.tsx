'use client';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import React from 'react';
import { Clock, ClockFading, Heart, HeartCrack, Medal, Target, TrendingUp, Trophy, X } from 'lucide-react';
import Chart from '../users/components/Performance/Chart';
import ChartPie from '../users/components/Performance/ChartPie';
import ChartBar from '../users/components/Performance/ChartBar';

const winLossDist = [
	{ type: "Wins", percent: 56 },
	{ type: "Losses", percent: 24 },
	{ type: "Draws", percent: 100 - 24 - 56 }
];

const winRateData = [
	{ date: "2023-01-01", winRate: 50 },
	{ date: "2023-01-02", winRate: 19 },
	{ date: "2023-01-03", winRate: 10 },
	{ date: "2023-01-03", winRate: 14 },
	{ date: "2023-01-04", winRate: 16 },
	{ date: "2023-01-05", winRate: 60 },
	{ date: "2023-01-06", winRate: 16 },
];

const avgScoreData = [
	{ date: "2023-01-01", avgScore: 5.5 },
	{ date: "2023-01-02", avgScore: 1.9 },
	{ date: "2023-01-03", avgScore: 1.0 },
	{ date: "2023-01-03", avgScore: 1.4 },
	{ date: "2023-01-04", avgScore: 1.6 },
	{ date: "2023-01-05", avgScore: 6.2 },
	{ date: "2023-01-06", avgScore: 6.1 },
];

const gameTypeDistData = [
	{ type: "Ping Pong", percent: 56 },
	{ type: "Tic Tac Toe", percent: 100 - 56 },
];

const gameModeDistData = [
	{ type: "Casual", percent: 22 },
	{ type: "1v1", percent: 33 },
	{ type: "Tournaments", percent: 24 },
	{ type: "Training", percent: 100 - 24 - 22 - 33 },
];

const timeSpentData = [
	{ date: "2023-01-01", timeSpent: 5 },
	{ date: "2023-01-02", timeSpent: 19 },
	{ date: "2023-01-03", timeSpent: 10 },
	{ date: "2023-01-03", timeSpent: 14 },
	{ date: "2023-01-04", timeSpent: 16 },
	{ date: "2023-01-05", timeSpent: 6 },
	{ date: "2023-01-06", timeSpent: 16 },
];

const gamesPerDayData = [
	{ date: "2023-01-01", games: 5 },
	{ date: "2023-01-02", games: 9 },
	{ date: "2023-01-03", games: 10 },
	{ date: "2023-01-03", games: 1 },
	{ date: "2023-01-04", games: 16 },
	{ date: "2023-01-05", games: 6 },
	{ date: "2023-01-06", games: 11 },
];

const data = {
	gameTypeDistData: [
		{ type: "Ping Pong", percent: 56 },
		{ type: "Tic Tac Toe", percent: 100 - 56 },
	],
	gameModeDistData: [
		{ type: "Casual", percent: 22 },
		{ type: "1v1", percent: 33 },
		{ type: "Tournaments", percent: 24 },
		{ type: "Training", percent: 100 - 24 - 22 - 33 },
	],
	winLossDist: [
	  { type: 'Wins', percent: 56 },
	  { type: 'Losses', percent: 24 },
	  { type: 'Draws', percent: 20 }
	],
	winRateTrend: [
	  { date: '2023-01-01', winRate: 50 },
	  { date: '2023-01-02', winRate: 19 },
	  { date: '2023-01-03', winRate: 10 },
	  { date: '2023-01-03', winRate: 14 },
	  { date: '2023-01-04', winRate: 16 },
	  { date: '2023-01-05', winRate: 60 },
	  { date: '2023-01-06', winRate: 16 }
	],
	avgScoreData: [
		{ date: "2023-01-01", avgScore: 5.5 },
		{ date: "2023-01-02", avgScore: 1.9 },
		{ date: "2023-01-03", avgScore: 1.0 },
		{ date: "2023-01-03", avgScore: 1.4 },
		{ date: "2023-01-04", avgScore: 1.6 },
		{ date: "2023-01-05", avgScore: 6.2 },
		{ date: "2023-01-06", avgScore: 6.1 },
	],
	gamesPerDay: [
		{ date: "2023-01-01", games: 5 },
		{ date: "2023-01-02", games: 9 },
		{ date: "2023-01-03", games: 10 },
		{ date: "2023-01-03", games: 1 },
		{ date: "2023-01-04", games: 16 },
		{ date: "2023-01-05", games: 6 },
		{ date: "2023-01-06", games: 11 },
	],
	timeSpent: [
		{ date: "2023-01-01", timeSpent: 5 },
		{ date: "2023-01-02", timeSpent: 19 },
		{ date: "2023-01-03", timeSpent: 10 },
		{ date: "2023-01-03", timeSpent: 14 },
		{ date: "2023-01-04", timeSpent: 16 },
		{ date: "2023-01-05", timeSpent: 6 },
		{ date: "2023-01-06", timeSpent: 16 },
	]
};

export function StatCard({ title, value, subtitle, icon, subtitleColor } : { title: string, value: string, subtitle: string, icon: React.ReactNode, subtitleColor: string }) {
	return (
		<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 flex flex-col gap-7 flex-1">
		<div className="flex items-center justify-between">
			<p className="font-bold text-xl">{title}</p>
			{icon}
		</div>
		<div className="flex items-end justify-between">
			<p className="font-extrabold text-3xl">{value}</p>
			<p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
		</div>
		</div>
	);
}

export function ChartCard({ title, subtitle, chart } : { title: string, subtitle: string, chart: React.ReactNode }) {
	return (
		<div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 flex flex-col h-full overflow-hidden">
			<h2 className="font-bold text-lg">{title}</h2>
			<p className="text-sm text-violet-400 mb-4">{subtitle}</p>
			<div className="flex-1 overflow-hidden">{chart}</div>
		</div>
	);
}

export default function StatsDashboard() {
	return (
		<main className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6">
			<div className="bg-white/4 border border-white/10 h-full w-full rounded-2xl backdrop-blur-2xl">
			<header className="relative shrink-0 overflow-hidden">
				<h1
				className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
				>
				Your Statistics
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			<section className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto h-full">
				<div className={`px-8 flex h-full flex-col gap-4  ${funnelDisplay.className}`}>

					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
							<StatCard
								title="Total Games"
								value="1489"
								subtitle="+23 from last week"
								subtitleColor="text-green-500"
								icon={<Trophy size={20} />}
							/>
							<StatCard
								title="Win Rate"
								value="73.1%"
								subtitle="+2.1% from last month"
								subtitleColor="text-green-500"
								icon={<Target size={20} />}
							/>
							<StatCard
								title="Average Score"
								value="13.6"
								subtitle="+2.4 from last week"
								subtitleColor="text-green-500"
								icon={<Trophy size={20} />}
							/>
							<StatCard
								title="Current Streak"
								value="14"
								subtitle="wins in a row"
								subtitleColor="text-yellow-500"
								icon={<TrendingUp size={20} />}
							/>
					</section>

					<section className='grid gap-4 xl:grid-cols-2 min-h-160 xl:min-h-80'>
						<ChartCard 
							title='Win Rate Trends'
							subtitle='Win rate over the last week'
							chart={<Chart data={data.winRateTrend} dataKey="winRate" unit="% Wins" />}
						/>
						<ChartCard 
							title='Wins / Losses'
							subtitle='Wins / Losses distribution'
							chart={<ChartPie data={data.winLossDist} nameKey="type" dataKey="percent" unit="%" />}
						/>
					</section>

					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
							<StatCard
								title="Total Playtime"
								value="556.7h"
								subtitle="+11h from last week"
								subtitleColor="text-green-500"
								icon={<ClockFading size={20} />}
							/>
							<StatCard
								title="Most Wins"
								value="sabona"
								subtitle="you won 55 games"
								subtitleColor="text-green-500"
								icon={<Medal size={20} />}
							/>
							<StatCard
								title="Most Losses"
								value="xezzuz"
								subtitle="you lost 44 games"
								subtitleColor="text-red-500"
								icon={<HeartCrack size={20} />}
							/>
							<StatCard
								title="Most Frequent Opponent"
								value="iassil"
								subtitle="you played 33 game"
								subtitleColor="text-yellow-500"
								icon={<Heart size={20} />}
							/>
					</section>

					<section className='grid gap-4 xl:grid-cols-2 min-h-160 xl:min-h-80'>
						<ChartCard 
							title='Time Spent'
							subtitle='Daily playtime over the last week'
							chart={<Chart data={data.timeSpent} dataKey="timeSpent" unit="hours" />}
						/>
						<ChartCard 
							title='Games Per Day'
							subtitle='Daily games over the last week'
							chart={<ChartBar data={data.gamesPerDay} nameKey='date' dataKey="games" unit="games" />}
						/>
					</section>

				</div>
			</section>
			</div>
		</main>
	);
}