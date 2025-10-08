import React from 'react';
import { ChartCard, StatDetailedCard } from '../Cards/Cards';
import Chart from '../Charts/Chart';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import ChartBar from '../Charts/ChartBar';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';

export default function TimeAnalysis({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	const { totals, scores, durations, opponents } = userAnalytics;

	const gamesPerDay = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, games: d.matches }));
	const timeSpent = totals.matches === 0 ? [] : userAnalyticsByDay.map(d => ({ date: d.day, timeSpent: (d.total_duration / 3600) }));

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
				<section className='grid gap-4 grid-cols-1 lg:grid-cols-3 h-300 lg:h-90'>
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
