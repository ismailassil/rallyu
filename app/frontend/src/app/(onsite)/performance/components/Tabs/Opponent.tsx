'use client';
import React from 'react';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { ChartCard, StatCard, StatDetailedCard } from '../Cards/Cards';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';
import CustomAreaChart from '@/app/(onsite)/performance/components/Charts/CustomAreaChart';
import CustomBarChart from '@/app/(onsite)/performance/components/Charts/CustomBarChart';

export default function Opponent({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const { totals, scores, opponents } = userAnalytics;

	const youVsOppTotalScore = totals.matches === 0 ? [] : [
		{ name: 'You', value: scores.total_user_score },
		{ name: 'Opponents', value: scores.total_opp_score }
	];

	const oppAvgScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.avg_opp_score }));
	const oppScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.total_opp_score }));

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
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-360 lg:h-120'>
						<ChartCard
							chartTitle='Opponents Score Trends'
							chartSubtitle='Score of your opponents over the last week'
							className='h-full'
							isEmpty={oppScoreTrend.length === 0}
						>
							<CustomAreaChart data={oppScoreTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => v + (v > 1 ? ' Points' : ' Point')}/>
						</ChartCard>
						<ChartCard
							chartTitle='Opponents Score Trends'
							chartSubtitle='Score of your opponents over the last week'
							className='h-full'
							isEmpty={youVsOppTotalScore.length === 0}
						>
							<CustomBarChart data={youVsOppTotalScore} nameKey='name' dataKey='value' tooltipFormatter={(v) => v + (v > 1 ? ' Points' : ' Point')} />
						</ChartCard>
						<ChartCard
							chartTitle='Opponents Average Score Trends'
							chartSubtitle='Average score of your opponents over the last week'
							className='h-full'
							isEmpty={oppAvgScoreTrend.length === 0}
						>
							<CustomAreaChart data={oppAvgScoreTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => v + (v > 1 ? ' Points' : ' Point')}/>
						</ChartCard>
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
