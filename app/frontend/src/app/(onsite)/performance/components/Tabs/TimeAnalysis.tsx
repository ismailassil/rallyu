import React from 'react';
import { ChartCard, StatDetailedCard } from '../Cards/Cards';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import CustomAreaChart from '@/app/(onsite)/performance/components/Charts/CustomAreaChart';
import { secondsToHMS } from '@/app/(api)/utils';
import CustomBarChart from '@/app/(onsite)/performance/components/Charts/CustomBarChart';
import { useTranslations } from 'next-intl';

export default function TimeAnalysis({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const t = useTranslations('performance_dashboard');
	const { totals, durations } = userAnalytics;

	const gamesPerDay = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.matches }));
	const timeSpent = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.total_duration }));

	return (
		<MainCardWrapper className='font-funnel-display pb-4 sm:pb-8'>
			<header className="relative overflow-x-hidden">
				<h1 className='font-bold py-10 px-13 select-none text-3xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'>
					{t('games.cards.time_analysis.title')}
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* YOUR TIME STATISTICS */}
			<div className='px-4 sm:px-10 flex flex-col gap-4'>
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-200 lg:h-120'>

					{/* CHARTS */}
					<ChartCard
						chartTitle={t('games.cards.time_analysis.cards.charts.time_spent.title')}
						chartSubtitle={t('games.cards.time_analysis.cards.charts.time_spent.subtitle')}
						className='h-full'
						isEmpty={timeSpent.length === 0}
					>
						<CustomAreaChart data={timeSpent} dataKeyX='date' dataKeyY='value' tooltipFormatter={secondsToHMS} />
					</ChartCard>
					<ChartCard
						chartTitle={t('games.cards.time_analysis.cards.charts.games_per_day.title')}
						chartSubtitle={t('games.cards.time_analysis.cards.charts.games_per_day.subtitle')}
						className='h-full'
						isEmpty={gamesPerDay.length === 0}
					>
						<CustomBarChart data={gamesPerDay} nameKey='name' dataKey='value' tooltipFormatter={(v) => t('common.games', { count: v })} />
					</ChartCard>

					{/* CARDS */}
					<div className='flex flex-col gap-4'>
						<StatDetailedCard
							title={t('games.cards.time_analysis.cards.duration_records.title')}
							items={[
								{ label: t('games.cards.time_analysis.cards.duration_records.1st'), value: `${Math.round(durations.max_duration / 60)}m` },
								{ label: t('games.cards.time_analysis.cards.duration_records.2nd'), value: `${Math.round(durations.min_duration / 60)}m` },
								{ label: t('games.cards.time_analysis.cards.duration_records.3rd'), value: `${Math.round(durations.avg_duration / 60)}m` }
							]}
						/>
						<StatDetailedCard
							title={t('games.cards.time_analysis.cards.avg_d_by_outcome.title')}
							items={[
								{ label: t('games.cards.time_analysis.cards.avg_d_by_outcome.1st'), value: `${Math.round(durations.avg_user_win_duration / 60)}m` },
								{ label: t('games.cards.time_analysis.cards.avg_d_by_outcome.2nd'), value: `${Math.round(durations.avg_user_loss_duration / 60)}m` },
								{ label: t('games.cards.time_analysis.cards.avg_d_by_outcome.3rd'), value: `${Math.round(durations.avg_user_draw_duration / 60)}m` }
							]}
						/>
					</div>
				</section>
			</div>
		</MainCardWrapper>
	);
}
