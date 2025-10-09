import React from 'react';
import { ChartCard, StatDetailedCard } from '../Cards/Cards';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import CustomAreaChart from '@/app/(onsite)/performance/components/Charts/CustomAreaChart';
import { secondsToHMS } from '@/app/(api)/utils';
import CustomBarChart from '@/app/(onsite)/performance/components/Charts/CustomBarChart';

export default function TimeAnalysis({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const { totals, durations } = userAnalytics;

	const gamesPerDay = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.matches }));
	const timeSpent = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, value: d.total_duration }));

	return (
		<MainCardWrapper className='font-funnel-display pb-4 sm:pb-8'>
			<header className="relative overflow-x-hidden">
				<h1 className='font-bold py-10 px-13 select-none text-3xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'>
					Time Analysis
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* YOUR TIME STATISTICS */}
			<div className='px-4 sm:px-10 flex flex-col gap-4'>
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-200 lg:h-120'>

					{/* CHARTS */}
					<ChartCard
						chartTitle='Time Spent'
						chartSubtitle='Daily playtime over the last week'
						className='h-full'
						isEmpty={timeSpent.length === 0}
					>
						<CustomAreaChart data={timeSpent} dataKeyX='date' dataKeyY='value' tooltipFormatter={secondsToHMS} />
					</ChartCard>
					<ChartCard
						chartTitle='Games Per Day'
						chartSubtitle='Daily games over the last week'
						className='h-full'
						isEmpty={gamesPerDay.length === 0}
					>
						<CustomBarChart data={gamesPerDay} nameKey='name' dataKey='value' tooltipFormatter={(v) => v + (v > 1 ? ' Games' : ' Game')} />
					</ChartCard>
					
					{/* CARDS */}
					<div className='flex flex-col gap-4'>
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
		</MainCardWrapper>
	);
}
