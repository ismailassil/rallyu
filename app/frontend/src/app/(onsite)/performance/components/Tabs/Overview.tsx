'use client';
import React from 'react';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { ChartCard, StatCard, StatDetailedCard } from '../Cards/Cards';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';
import CustomAreaChart from '@/app/(onsite)/performance/components/Charts/CustomAreaChart';
import CustomPieChart from '@/app/(onsite)/performance/components/Charts/CustomPieChart';

export default function Overview({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const { totals, scores, durations } = userAnalytics;

	const winLossDist = totals.matches === 0 ? [] : [
		{ name: 'Wins', value: Number(((totals.wins / totals.matches) * 100).toFixed(2)) },
		{ name: 'Losses', value: Number(((totals.losses / totals.matches) * 100).toFixed(2)) },
		{ name: 'Draws', value: Number(((totals.draws / totals.matches) * 100).toFixed(2)) }
	];

	const winRateTrend =  totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.win_rate }));
	const avgScoreTrend = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.avg_user_score }));

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
					Your Statistics
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* YOUR STATISTICS */}
			<div className='px-4 sm:px-10 flex flex-col gap-4'>
				{/* FIRST CARDS */}
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
						subtitle={`${scores.total_user_score - scores.total_opp_score > 0 ? '+' : ''}${scores.total_user_score - scores.total_opp_score} net differential`}
						subtitleColor={scores.total_user_score - scores.total_opp_score >= 0 ? 'text-green-500' : 'text-red-500'}
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

				{/* CHARTS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-360 lg:h-120'>
						<ChartCard
							chartTitle='Win Rate Trends'
							chartSubtitle='Win rate over the last week'
							className='h-full'
							isEmpty={winRateTrend.length === 0}
						>
							<CustomAreaChart data={winRateTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => v + '%'}/>
						</ChartCard>
						<ChartCard
							chartTitle='Wins / Losses'
							chartSubtitle='Wins / Losses distribution over time'
							className='h-full'
							isEmpty={winLossDist.length === 0}
						>
							<CustomPieChart data={winLossDist}  nameKey='name' dataKey='value' tooltipFormatter={(v) => v + '%'}/>
						</ChartCard>
						<ChartCard
							chartTitle='Average Score Trends'
							chartSubtitle='Average score over the last week'
							className='h-full'
							isEmpty={avgScoreTrend.length === 0}
						>
							<CustomAreaChart data={avgScoreTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => v + (v > 1 ? ' Points' : ' Point')}/>
						</ChartCard>
				</section>

				{/* SECOND CARDS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
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
			</div>
		</MainCardWrapper>
		</motion.div>
	);
}
