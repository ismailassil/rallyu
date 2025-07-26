import React from 'react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Calendar, Clock, Target, TrendingUp, TrendingUpDown, Trophy, User2 } from 'lucide-react';
import Chart from '../components/Chart';
import ChartPie from '../components/ChartPie';
import ChartBar from '../components/ChartBar';

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

function StatCard({ title, value, subtitle, subtitleColor, icon } : { title: string, value: string, subtitle: string, icon: React.ReactNode, subtitleColor: string }) {
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

const StatsCardV1: React.FC<StatCardProps> = ({ title, items }) => (
	<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 overflow-hidden flex-2">
		<h1 className="font-bold text-xl mb-4">{title}</h1>
		<div className="flex flex-col gap-1">
			{items.map((item, idx) => (
			<div key={idx} className="flex justify-between">
				<p className="font-medium text-lg text-white/70">{item.label}</p>
				<p className={`font-extrabold text-xl ${item.valueClass ?? "text-white/90"}`}>
				{item.value}
				</p>
			</div>
			))}
		</div>
	</div>
);

export function ChartCard({ title, subtitle, chart } : { title: string, subtitle: string, chart: React.ReactNode }) {
	return (
		<div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 flex flex-col h-full overflow-hidden">
			<h2 className="font-bold text-lg">{title}</h2>
			<p className="text-sm text-violet-400 mb-4">{subtitle}</p>
			<div className="flex-1 overflow-hidden">{chart}</div>
		</div>
	);
}

export default function newstats() {
	return (
		<main className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6">
			<div className="bg-white/4 border border-white/10  w-full rounded-2xl backdrop-blur-2xl pb-12">
				<header className="relative shrink-0 overflow-hidden">
					<h1
					className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
					>
						Your Statistics
					</h1>
					<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
				</header>

				{/* FIRST PART */}
				<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-4`}>
					{/* LINE1 */}
					<section className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
						<StatCard
							title="Total Matches"
							value="247"
							subtitle="156W / 73L / 18D"
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Win Rate"
							value="73.1%"
							subtitle="+2.1% from last month"
							subtitleColor="text-green-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Points Scored"
							value="3842"
							subtitle="+951 net differential"
							subtitleColor="text-green-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Time Played"
							value="307h"
							subtitle="1842 minutes total"
							subtitleColor="text-yellow-500"
							icon={<Clock size={20} />}
						/>
					</section>

					{/* LINE2 */}
					<section className='grid gap-4 grid-cols-3 h-90'>
							<ChartCard 
								title='Win Rate Trends'
								subtitle='Win rate over the last week'
								chart={<Chart data={data.winRateTrend} dataKey="winRate" unit="% Wins" />}
							/>
							<ChartCard 
								title='Wins / Losses'
								subtitle='Wins / Losses distribution over time'
								chart={<ChartPie data={data.winLossDist} nameKey="type" dataKey="percent" unit="%" />}
							/>
							<ChartCard 
								title='Average Score Trends'
								subtitle='Average score over the last week'
								chart={<Chart data={data.timeSpent} dataKey="timeSpent" unit="hours" />}
							/>
					</section>

					{/* LINE3 */}
					<section className='grid gap-4 grid-cols-4'>
						<StatsCardV1
							title="Today Performance"
							items={[
								{ label: "Matches", value: 12 },
								{ label: "Wins", value: 56 },
								{ label: "Losses", value: 22 },
								{ label: "Draws", value: 12 },
							]}
						/>
						<StatsCardV1
							title="Score Records"
							items={[
								{ label: "Highest Score", value: 45 },
								{ label: "Lowest Score", value: 2 },
								{ label: "Average Score", value: 15.6 }
							]}
						/>
						<StatsCardV1
							title="Average Points by Outcome"
							items={[
								{ label: "Per Win", value: "19.8" },
								{ label: "Per Loss", value: "6.3" },
								{ label: "Per Draw", value: "15.2" }
							]}
						/>
						<StatsCardV1
							title="Record Streaks"
							items={[
								{ label: "Longest Win", value: 12 },
								{ label: "Longest Loss", value: 56 },
								{ label: "Longest Draw", value: 22 },
							]}
						/>
					</section>

					{/* LINE4 */}
					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
						<StatCard
							title="Clutch Wins"
							value="23"
							subtitle="14.7% of wins"
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Blowout Wins"
							value="34"
							subtitle="21.7% of wins"
							subtitleColor="text-green-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Blowout Losses"
							value="18"
							subtitle="24.7% of losses"
							subtitleColor="text-red-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Shutouts"
							value="7"
							subtitle="4.5% of wins"
							subtitleColor="text-blue-500"
							icon={<Clock size={20} />}
						/>
					</section>
				</div>

				{/* OPPONENT */}
				<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-4 mt-6`}>
					<header className="relative shrink-0 overflow-hidden -left-10">
						<h1
						className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
						>
							Opponent Analysis
						</h1>
						<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
					</header>
					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
						<StatCard
							title="Most Wins"
							value="sabona"
							subtitle="you won 56 matches"
							subtitleColor="text-green-500"
							icon={<Clock size={20} />}
						/>
						<StatCard
							title="Most Frequent"
							value="iassil"
							subtitle="55 matches"
							subtitleColor="text-yellow-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Most Losses"
							value="xezzuz"
							subtitle="you lost 112 matches"
							subtitleColor="text-red-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Opponents"
							value="42"
							subtitle="unique players"
							subtitleColor="text-blue-500"
							icon={<Trophy size={20} />}
						/>
					</section>
				</div>

				{/* TIME */}
				<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-4 mt-6`}>
					<header className="relative shrink-0 overflow-hidden -left-10">
						<h1
						className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
						>
							Time Analysis
						</h1>
						<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
					</header>
					<section className='grid gap-4 grid-cols-3 h-90'>
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
						<div className='flex flex-col gap-2'>
							<StatsCardV1
								title="Match Duration"
								items={[
									{ label: "Longest Match", value: "47m" },
									{ label: "Shortest Match", value: "6m" },
									{ label: "Average Match", value: "15m" }
								]}
							/>
							<StatsCardV1
								title="Match Duration"
								items={[
									{ label: "Fastest Win", value: "47m" },
									{ label: "Fastest Loss", value: "6m" },
									{ label: "Average W/L", value: "15m" },
								]}
							/>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
