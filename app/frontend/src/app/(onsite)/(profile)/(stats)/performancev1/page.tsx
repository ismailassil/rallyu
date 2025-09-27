'use client';
import React, { useEffect, useState } from 'react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import Chart from '../components/Charts/Chart';
import ChartPie from '../components/Charts/ChartPie';
import ChartBar from '../components/Charts/ChartBar';
import { ChartCard, StatCard, StatDetailedCard } from '../components/Cards';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { APIError } from '@/app/(api)/APIClient';
import { toastError } from '@/app/(auth)/components/CustomToast';
import { AuthLoadingSpinner } from '@/app/(auth)/components/LoadingSpinners';

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

export default function UserStatsPage() {
	const { apiClient, loggedInUser } = useAuth();
	const [userAnalytics, setUserAnalytics] = useState(null);
	const [userAnalyticsByDay, setUserAnalyticsByDay] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	
	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				setIsLoading(true);
				const analytics = await apiClient.fetchUserAnalytics(loggedInUser!.username);
				const analyticsByDay = await apiClient.fetchUserAnalyticsByDay(loggedInUser!.username);
				setUserAnalytics(analytics);
				setUserAnalyticsByDay(analyticsByDay);
				setIsLoading(false);
			} catch (err) {

				const apiErr = err as APIError;
				toastError(apiErr.message);
				
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserAnalytics();
	}, []);

	if (isLoading || !userAnalytics)
		return <AuthLoadingSpinner />;

	const { totals, scores, durations, opponents } = userAnalytics;

	const winLossDist = [
		{ type: 'Wins', percent: Number(((totals.wins / totals.matches) * 100).toFixed(2)) },
		{ type: 'Losses', percent: Number(((totals.losses / totals.matches) * 100).toFixed(2)) },
		{ type: 'Draws', percent: Number(((totals.draws / totals.matches) * 100).toFixed(2)) }
	];

	const winRateTrend = userAnalyticsByDay!.map(d => ({ date: d.day, winRate: d.win_rate }));
	const avgScoreTrend = userAnalyticsByDay!.map(d => ({ date: d.day, avgScore: d.avg_user_score }));
	const oppAvgScoreTrend = userAnalyticsByDay!.map(d => ({ date: d.day, avgScore: d.avg_opp_score }));
	const oppScoreTrend = userAnalyticsByDay!.map(d => ({ date: d.day, score: d.total_opp_score }));
	const gamesPerDay = userAnalyticsByDay!.map(d => ({ date: d.day, games: d.matches }));
	// const timeSpent = userAnalyticsByDay!.map(d => {
	// 	const hours = Math.floor(d.total_duration / 3600);
	// 	const minutes = Math.floor((d.total_duration % 3600) / 60);

	// 	let durationString = '';
	// 	if (hours > 0) durationString += `${hours}h`;
	// 	durationString += `${minutes}m`;
	// 	return { date: d.day, timeSpent: d.total_duration, unit: durationString };
	// });
	const timeSpent = userAnalyticsByDay!.map(d => ({ date: d.day, timeSpent: (d.total_duration / 3600).toFixed(1) }));

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
							value={totals.matches}
							subtitle={`${totals.wins}W / ${totals.losses}L / ${totals.draws}D`}
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Win Rate"
							value={totals.win_rate}
							suffix='%'
							decimals={2}
							subtitle=""
							subtitleColor="text-green-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Points Scored"
							value={scores.total_user_score}
							subtitle={`+${scores.total_user_score - scores.total_opp_score} net differential`}
							subtitleColor="text-green-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Time Played"
							value={durations.total_duration / 3600}
							suffix='h'
							decimals={2}
							subtitle={`${Math.round(durations.total_duration / 60)} minutes total`}
							subtitleColor="text-yellow-500"
							icon={<Clock size={20} />}
						/>
					</section>

					{/* LINE2 */}
					<section className='grid gap-4 grid-cols-3 h-90'>
							<ChartCard 
								title='Win Rate Trends'
								subtitle='Win rate over the last week'
								chart={<Chart data={winRateTrend} dataKey="winRate" unit="% Wins" />}
							/>
							<ChartCard 
								title='Wins / Losses'
								subtitle='Wins / Losses distribution over time'
								chart={<ChartPie data={winLossDist} nameKey="type" dataKey="percent" unit="%" />}
							/>
							<ChartCard 
								title='Average Score Trends'
								subtitle='Average score over the last week'
								chart={<Chart data={avgScoreTrend} dataKey="avgScore" unit="points" />}
							/>
					</section>

					{/* LINE3 */}
					<section className='grid gap-4 grid-cols-2'>
						<StatDetailedCard
							title="Score Records"
							items={[
								{ label: 'Highest Score', value: scores.max_user_score },
								{ label: 'Lowest Score', value: scores.min_user_score },
								{ label: 'Average Score', value: scores.avg_user_score.toFixed(2) }
							]}
						/>
						<StatDetailedCard
							title="Average Points by Outcome"
							items={[
								{ label: 'Per Win', value: scores.avg_user_win_score.toFixed(2) },
								{ label: 'Per Loss', value: scores.avg_user_loss_score.toFixed(2) },
								{ label: 'Per Draw', value: scores.avg_user_draw_score.toFixed(2) }
							]}
						/>
					</section>

					{/* LINE4 */}
					{/* <section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
						<StatCard
							title="Clutch Wins --"
							value="23"
							subtitle="14.7% of wins"
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Blowout Wins --"
							value="34"
							subtitle="21.7% of wins"
							subtitleColor="text-green-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Blowout Losses --"
							value="18"
							subtitle="24.7% of losses"
							subtitleColor="text-red-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Shutouts --"
							value="7"
							subtitle="4.5% of wins"
							subtitleColor="text-blue-500"
							icon={<Clock size={20} />}
						/>
					</section> */}
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

					{/* LINE1 */}
					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
					<StatCard
							title="Most Wins"
							value={opponents.mostWinsOpponent.opponent_username}
							subtitle={`you won ${opponents.mostWinsOpponent.wins} matches`}
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Most Frequent"
							value={opponents.mostFrequentOpponent.opponent_username}
							subtitle={`${opponents.mostFrequentOpponent.matches} matches`}
							subtitleColor="text-yellow-500"
							icon={<TrendingUp size={20} />}
						/>
						<StatCard
							title="Most Losses"
							value={opponents.mostLossesOpponent.opponent_username}
							subtitle={`you lost ${opponents.mostLossesOpponent.losses} matches`}
							subtitleColor="text-red-500"
							icon={<Target size={20} />}
						/>
						<StatCard
							title="Opponents"
							value={opponents.uniqueOpponents.unique_opponents}
							subtitle="unique players"
							subtitleColor="text-blue-500"
							icon={<Clock size={20} />}
						/>
					</section>

					{/* LINE2 */}
					<section className='grid gap-4 grid-cols-3 h-90'>
							<ChartCard 
								title='Opponents Score Trends'
								subtitle='*Average score over the last week'
								chart={<Chart data={oppScoreTrend} dataKey="score" unit="points" />}
							/>
							<ChartCard
								title="You vs Opponent Total Scores"
								subtitle="Points comparison"
								chart={
									<ChartBar
										data={[
											{ name: 'You', score: scores.total_user_score },
											{ name: 'Opponents', score: scores.total_opp_score }
										]}
										nameKey="name"
										dataKey="score"
										unit="pts"
									/>
								}
							/>
							<ChartCard 
								title='Average Score Trends'
								subtitle='Average score over the last week'
								chart={<Chart data={oppAvgScoreTrend} dataKey="avgScore" unit="points" />}
							/>
							
					</section>

					{/* LINE3 */}
					<section className='grid gap-4 grid-cols-2'>
						<StatDetailedCard
							title="Score Records"
							items={[
								{ label: 'Highest Score', value: scores.max_opp_score },
								{ label: 'Lowest Score', value: scores.min_opp_score },
								{ label: 'Average Score', value: scores.avg_opp_score.toFixed(2) }
							]}
						/>
						<StatDetailedCard
							title="Average Points by Outcome"
							items={[
								{ label: 'Per Win', value: scores.avg_opp_win_score.toFixed(2) },
								{ label: 'Per Loss', value: scores.avg_opp_loss_score.toFixed(2) },
								{ label: 'Per Draw', value: scores.avg_opp_draw_score.toFixed(2) }
							]}
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
							chart={<Chart data={timeSpent} dataKey="timeSpent" unit="hours" />}
						/>
						<ChartCard 
							title='Games Per Day'
							subtitle='Daily games over the last week'
							chart={<ChartBar data={gamesPerDay} nameKey='date' dataKey="games" unit="games" />}
						/>
						<div className='flex flex-col gap-2'>
							<StatDetailedCard
								title="Match Durations"
								items={[
									{ label: 'Longest Match', value: `${Math.round(durations.max_duration / 60)}m` },
									{ label: 'Shortest Match', value: `${Math.round(durations.min_duration / 60)}m` },
									{ label: 'Average Match', value: `${Math.round(durations.avg_duration / 60)}m` }
								]}
							/>
							<StatDetailedCard
								title="Outcome Durations"
								items={[
									{ label: 'Avg Win', value: `${Math.round(durations.avg_user_win_duration / 60)}m` },
									{ label: 'Avg Loss', value: `${Math.round(durations.avg_user_loss_duration / 60)}m` },
									{ label: 'Avg Draw', value: `${Math.round(durations.avg_user_draw_duration / 60)}m` }
								]}
							/>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
