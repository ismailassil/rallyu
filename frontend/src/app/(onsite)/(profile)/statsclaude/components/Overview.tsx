import React from 'react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Calendar, Clock, Target, TrendingUp, TrendingUpDown, Trophy, User2 } from 'lucide-react';

const StatsCardV1: React.FC<StatCardProps> = ({ title, items }) => (
	<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 overflow-hidden flex-2">
		<h1 className="font-bold text-xl mb-4">{title}</h1>
		<div className="flex flex-col gap-1">
			{items.map((item, idx) => (
			<div key={idx} className="flex justify-between">
				<p className="font-medium text-lg text-white/70">{item.label}</p>
				<p className={`font-extrabold text-xl ${item.valueClass ?? "text-white/90"}`}>
				{item.value}
				</p>
			</div>
			))}
		</div>
	</div>
);

function StatCard({ title, value, subtitle, subtitleColor, icon } : { title: string, value: string, subtitle: string, icon: React.ReactNode, subtitleColor: string }) {
	return (
		<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 flex flex-col gap-7 flex-1">
		<div className="flex items-center justify-between">
			<p className="font-bold text-xl">{title}</p>
			{icon}
		</div>
		<div className="flex items-end justify-between">
			<p className="font-extrabold text-3xl">{value}</p>
			<p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
		</div>
		</div>
	);
}

export default function Overview() {
	return (
		<div className={`px-10 ${funnelDisplay.className} flex flex-col gap-12`}>
				{/* STAT CARDS */}
				<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
					<StatCard
						title="Total Matches"
						value="247"
						subtitle="156W / 73L / 18D"
						subtitleColor="text-green-500"
						icon={<Trophy size={20} />}
					/>
					<StatCard
						title="Win Rate"
						value="73.1%"
						subtitle="+2.1% from last month"
						subtitleColor="text-green-500"
						icon={<TrendingUp size={20} />}
					/>
					<StatCard
						title="Points Scored"
						value="3842"
						subtitle="+951 net differential"
						subtitleColor="text-green-500"
						icon={<Target size={20} />}
					/>
					<StatCard
						title="Time Played"
						value="307h"
						subtitle="1842 minutes total"
						subtitleColor="text-yellow-500"
						icon={<Clock size={20} />}
					/>
				</section>
				{/* TODAY PERFORMANCE */}
				<section className='bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3'>
					<div className='flex items-center gap-3'>
						<Calendar size={26} />
						<h1 className='font-extrabold text-3xl'>Today&#39;s Performance</h1>
					</div>
					<div className='flex justify-around py-6'>
						<div className='flex flex-col items-center gap-1'>
							<p className='font-extrabold text-3xl text-white'>5</p>
							<p className='font-medium text-lg'>Matches</p>
						</div>
						<div className='flex flex-col items-center gap-1'>
							<p className='font-extrabold text-3xl text-green-500'>3</p>
							<p className='font-medium text-lg'>Wins</p>
						</div>
						<div className='flex flex-col items-center gap-1'>
							<p className='font-extrabold text-3xl text-red-500'>2</p>
							<p className='font-medium text-lg'>Losses</p>
						</div>
						<div className='flex flex-col items-center gap-1'>
							<p className='font-extrabold text-3xl text-white'>0</p>
							<p className='font-medium text-lg'>Draws</p>
						</div>
					</div>
				</section>
				{/* EXTRA STATS */}
				<section className='grid gap-4 lg:grid-cols-3'>
					<StatsCardV1
						title="Current Streaks"
						items={[
							{ label: "Win Streak", value: 56 },
							{ label: "Loss Streak", value: 22 },
							{ label: "Draw Streak", value: 12 }
						]}
					/>
					<StatsCardV1
						title="Record Streaks"
						items={[
							{ label: "Longest Win", value: 56 },
							{ label: "Longest Loss", value: 22 },
							{ label: "Longest Draw", value: 12 }
						]}
					/>
					<StatsCardV1
						title="Session Stats"
						items={[
							{ label: "Longest Session", value: "15:12" },
							{ label: "Shortest Session", value: "6:33" },
							{ label: "Average Session", value: "2h 14m" }
						]}
					/>
				</section>
		</div>
	);
}
