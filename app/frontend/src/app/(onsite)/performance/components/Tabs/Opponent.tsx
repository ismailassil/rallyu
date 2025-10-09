'use client';
import React from 'react';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { ChartCard, StatCard, StatDetailedCard } from '../Cards/Cards';
import Chart from '../Charts/Chart';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import ChartBar from '../Charts/ChartBar';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';

export default function Opponent({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const { totals, scores, durations, opponents } = userAnalytics;

	const winLossDist = totals.matches === 0 ? [] : [
		{ type: 'Wins', percent: Number(((totals.wins / totals.matches) * 100).toFixed(2)) },
		{ type: 'Losses', percent: Number(((totals.losses / totals.matches) * 100).toFixed(2)) },
		{ type: 'Draws', percent: Number(((totals.draws / totals.matches) * 100).toFixed(2)) }
	];
	const youVsOppTotalScore = totals.matches === 0 ? [] : [
		{ name: 'You', score: scores.total_user_score },
		{ name: 'Opponents', score: scores.total_opp_score }
	];

	const winRateTrend =  totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, winRate: d.win_rate }));
	const avgScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, avgScore: d.avg_user_score }));

	const oppAvgScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, avgScore: d.avg_opp_score }));
	const oppScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, score: d.total_opp_score }));

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
		>
		<MainCardWrapper className='font-funnel-display pb-4 sm:pb-8'>
			<header className="relative overflow-x-hidden">
				<h1 className='font-bold py-10 px-13 select-none text-3xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'>
					Opponent Analysis
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* OPPONENT STATISTICS */}
			<div className='px-4 sm:px-10 flex flex-col gap-4'>
				{/* FIRST CARDS */}
				<section className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
					<StatCard
						title="Most Wins"
						value={opponents.mostWinsOpponent.opponent_username || '-'}
						subtitle={`you won ${opponents.mostWinsOpponent.wins} matches`}
						subtitleColor="text-green-500"
						icon={<Trophy size={20} />}
					/>
					<StatCard
						title="Most Frequent"
						value={opponents.mostFrequentOpponent.opponent_username || '-'}
						subtitle={`${opponents.mostFrequentOpponent.matches} matches`}
						subtitleColor="text-yellow-500"
						icon={<TrendingUp size={20} />}
					/>
					<StatCard
						title="Most Losses"
						value={opponents.mostLossesOpponent.opponent_username || '-'}
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

				{/* CHARTS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-300 lg:h-120'>
						<ChartCard 
							title='Opponents Score Trends'
							subtitle='Score of your opponents over the last week'
							chart={<Chart data={oppScoreTrend} dataKey="score" unit="points" />}
						/>
						<ChartCard
							title="You vs Opponent Total Scores"
							subtitle="Points comparison"
							chart={
								<ChartBar
									data={youVsOppTotalScore}
									nameKey="name"
									dataKey="score"
									unit="pts"
								/>
							}
						/>
						<ChartCard 
							title='Opponents Average Score Trends'
							subtitle='Average score of your opponents over the last week'
							chart={<Chart data={oppAvgScoreTrend} dataKey="avgScore" unit="points" />}
						/>
						
				</section>

				{/* SECOND CARDS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
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
		</MainCardWrapper>
		</motion.div>
	);
}
