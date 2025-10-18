'use client';
import React from 'react';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { ChartCard, StatCard, StatDetailedCard } from '../Cards/Cards';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';
import CustomAreaChart from '@/app/(onsite)/performance/components/Charts/CustomAreaChart';
import CustomPieChart from '@/app/(onsite)/performance/components/Charts/CustomPieChart';
import { useTranslations } from 'next-intl';

export default function Overview({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const t = useTranslations('performance_dashboard');
	const { totals, scores, durations } = userAnalytics;

	const winLossDist = totals.matches === 0 ? [] : [
		{ name: t('overview.cards.your_statistics.cards.charts.wins_vs_losses.common.wins'), value: Number(((totals.wins / totals.matches) * 100).toFixed(2)) },
		{ name: t('overview.cards.your_statistics.cards.charts.wins_vs_losses.common.losses'), value: Number(((totals.losses / totals.matches) * 100).toFixed(2)) },
		{ name: t('overview.cards.your_statistics.cards.charts.wins_vs_losses.common.draws'), value: Number(((totals.draws / totals.matches) * 100).toFixed(2)) }
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
					{t('overview.cards.your_statistics.title')}
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* YOUR STATISTICS */}
			<div className='px-4 sm:px-10 flex flex-col gap-4'>
				{/* FIRST CARDS */}
				<section className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
					<StatCard
						title={t('overview.cards.your_statistics.cards.total_matches.title')}
						value={totals.matches}
						subtitle={`${totals.wins}W / ${totals.losses}L / ${totals.draws}D`}
						subtitleColor="text-green-500"
						icon={<Trophy size={20} />}
					/>
					<StatCard
						title={t('overview.cards.your_statistics.cards.win_rate.title')}
						value={totals.win_rate}
						suffix='%'
						decimals={2}
						subtitle=""
						subtitleColor="text-green-500"
						icon={<TrendingUp size={20} />}
					/>
					<StatCard
						title={t('overview.cards.your_statistics.cards.points_scored.title')}
						value={scores.total_user_score}
						subtitle={`${scores.total_user_score - scores.total_opp_score > 0 ? '+' : ''}${scores.total_user_score - scores.total_opp_score} ${t('overview.cards.your_statistics.cards.points_scored.subtitle')}`}
						subtitleColor={scores.total_user_score - scores.total_opp_score >= 0 ? 'text-green-500' : 'text-red-500'}
						icon={<Target size={20} />}
					/>
					<StatCard
						title={t('overview.cards.your_statistics.cards.time_played.title')}
						value={durations.total_duration / 3600}
						suffix='h'
						decimals={2}
						subtitle={t('overview.cards.your_statistics.cards.time_played.subtitle', { count: Math.round(durations.total_duration / 60) })}
						subtitleColor="text-yellow-500"
						icon={<Clock size={20} />}
					/>
				</section>

				{/* CHARTS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-360 lg:h-120'>
						<ChartCard
							chartTitle={t('overview.cards.your_statistics.cards.charts.win_rate_trends.title')}
							chartSubtitle={t('overview.cards.your_statistics.cards.charts.win_rate_trends.subtitle')}
							className='h-full'
							isEmpty={winRateTrend.length === 0}
						>
							<CustomAreaChart data={winRateTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => v + '%'}/>
						</ChartCard>
						<ChartCard
							chartTitle={t('overview.cards.your_statistics.cards.charts.wins_vs_losses.title')}
							chartSubtitle={t('overview.cards.your_statistics.cards.charts.wins_vs_losses.subtitle')}
							className='h-full'
							isEmpty={winLossDist.length === 0}
						>
							<CustomPieChart data={winLossDist}  nameKey='name' dataKey='value' tooltipFormatter={(v) => v + '%'}/>
						</ChartCard>
						<ChartCard
							chartTitle={t('overview.cards.your_statistics.cards.charts.avg_score_trends.title')}
							chartSubtitle={t('overview.cards.your_statistics.cards.charts.avg_score_trends.subtitle')}
							className='h-full'
							isEmpty={avgScoreTrend.length === 0}
						>
							<CustomAreaChart data={avgScoreTrend} dataKeyX='date' dataKeyY='value' tooltipFormatter={(v) => t('common.points', { count: v })}/>
						</ChartCard>
				</section>

				{/* SECOND CARDS */}
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
					<StatDetailedCard
						title={t('overview.cards.your_statistics.cards.score_records.title')}
						items={[
							{ label: t('overview.cards.your_statistics.cards.score_records.1st'), value: scores.max_user_score },
							{ label: t('overview.cards.your_statistics.cards.score_records.2nd'), value: scores.min_user_score },
							{ label: t('overview.cards.your_statistics.cards.score_records.3rd'), value: scores.avg_user_score.toFixed(2) }
						]}
					/>
					<StatDetailedCard
						title={t('overview.cards.your_statistics.cards.avg_p_by_outcome.title')}
						items={[
							{ label: t('overview.cards.your_statistics.cards.avg_p_by_outcome.1st'), value: scores.avg_user_win_score.toFixed(2) },
							{ label: t('overview.cards.your_statistics.cards.avg_p_by_outcome.2nd'), value: scores.avg_user_loss_score.toFixed(2) },
							{ label: t('overview.cards.your_statistics.cards.avg_p_by_outcome.3rd'), value: scores.avg_user_draw_score.toFixed(2) }
						]}
					/>
				</section>
			</div>
		</MainCardWrapper>
		</motion.div>
	);
}
