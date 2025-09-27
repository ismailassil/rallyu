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
import { toastError } from '@/app/components/CustomToast';
import { AuthLoadingSpinner } from '@/app/(auth)/components/LoadingSpinners';

export default function UserStatsPage() {
	const { apiClient, loggedInUser } = useAuth();
	const [userAnalytics, setUserAnalytics] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	
	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				setIsLoading(true);
				const data = await apiClient.fetchUserAnalytics(loggedInUser!.username);
				setUserAnalytics(data);
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

	// derived data
	const winLossDist = [
		{ type: 'Wins', percent: Number(((totals.wins / totals.matches) * 100).toFixed(2)) },
		{ type: 'Losses', percent: Number(((totals.losses / totals.matches) * 100).toFixed(2)) },
		{ type: 'Draws', percent: Number(((totals.draws / totals.matches) * 100).toFixed(2)) }
	];

	return (
		<main className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6">
			<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl pb-12">
				<header className="relative shrink-0 overflow-hidden">
					<h1
						className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
					>
						Your Statistics
					</h1>
					<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0]" />
				</header>

				{/* SUMMARY */}
				<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-4`}>
					<section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
						<StatCard
							title="Total Matches"
							value={totals.matches}
							subtitle={`${totals.wins}W / ${totals.losses}L / ${totals.draws}D`}
							subtitleColor="text-green-500"
							icon={<Trophy size={20} />}
						/>
						<StatCard
							title="Win Rate"
							value={`${totals.win_rate.toFixed(2)}%`}
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
							value={`${(durations.total_duration / 3600).toFixed(1)}h`}
							subtitle={`${Math.round(durations.total_duration / 60)} minutes total`}
							subtitleColor="text-yellow-500"
							icon={<Clock size={20} />}
						/>
					</section>

					{/* DISTRIBUTIONS */}
					<section className="grid gap-4 grid-cols-3 h-90">
						<ChartCard
							title="Win Rate Distribution"
							subtitle="Wins vs losses vs draws"
							chart={<ChartPie data={winLossDist} nameKey="type" dataKey="percent" unit="%" />}
						/>
						<ChartCard
							title="User vs Opponent Total Scores"
							subtitle="Points comparison"
							chart={
								<ChartBar
									data={[
										{ name: 'User', score: scores.total_user_score },
										{ name: 'Opponents', score: scores.total_opp_score }
									]}
									nameKey="name"
									dataKey="score"
									unit="pts"
								/>
							}
						/>
						<ChartCard
							title="Average Scores"
							subtitle="User vs Opponents"
							chart={
								<ChartBar
									data={[
										{ name: 'User', score: scores.avg_user_score },
										{ name: 'Opponents', score: scores.avg_opp_score }
									]}
									nameKey="name"
									dataKey="score"
									unit="pts"
								/>
							}
						/>
					</section>

					{/* DETAILS */}
					<section className="grid gap-4 grid-cols-4">
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
						<StatDetailedCard
							title="Match Durations"
							items={[
								{ label: 'Longest', value: `${Math.round(durations.max_duration / 60)}m` },
								{ label: 'Shortest', value: `${Math.round(durations.min_duration / 60)}m` },
								{ label: 'Average', value: `${Math.round(durations.avg_duration / 60)}m` }
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
					</section>
				</div>

				{/* OPPONENTS */}
				<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-4 mt-6`}>
					<header className="relative shrink-0 overflow-hidden -left-10">
						<h1
							className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
						>
							Opponent Analysis
						</h1>
					</header>
					<section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
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
				</div>
			</div>
		</main>
	);
}
