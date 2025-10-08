'use client';
import React from 'react';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { ChartCard, StatCard, StatDetailedCard } from '../Cards/Cards';
import Chart from '../Charts/Chart';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import ChartPie from '../Charts/ChartPie';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';

export default function Overview({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
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
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-300 lg:h-120'>
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
