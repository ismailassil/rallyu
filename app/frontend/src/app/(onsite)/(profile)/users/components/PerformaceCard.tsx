import CountUp from "react-countup";
import Chart from "./Chart";
import Image from "next/image";
import MainCardWithHeader from "@/app/(onsite)/(refactoredUIComponents)/MainCardWithHeader";
import ChartCardWrapper from "@/app/(onsite)/(refactoredUIComponents)/ChartCardWrapper";

type PerformanceCardProps = {
	totalXP: number,
	totalMatches: number,
	longestStreak: number,
	wins: number,
	losses: number,
	draws: number,
	timeSpent: { day: string, total_duration: number }[]
}

export default function PerformanceCard({ totalXP, totalMatches, longestStreak, wins, losses, draws, timeSpent } : PerformanceCardProps) {
	const timeSpentToShow = timeSpent.map((item) => ({ date: item.day, timeSpent: item.total_duration / 60 }));

	return (
		<MainCardWithHeader headerName='Performance' color='notwhite' className='font-funnel-display flex-3'>
			<div className="group flex flex-col gap-4 px-6">
				<div className="profile-inner-stat-card">
					<p className="text-2xl text-white/60 font-bold">Total XP</p>
					<p className="text-3xl text-white/80 font-bold">
						<CountUp end={totalXP} /> XP
					</p>
				</div>

				<div className="flex gap-4">
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
							Games
							<span className="inline lg:hidden"> </span>
							<span className="hidden sm:inline"><br /></span>
							Played
						</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp end={totalMatches} />
						</p>
					</div>
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
							Longest
							<span className="inline lg:hidden"> </span>
							<span className="hidden sm:inline"><br /></span>
							Streak
						</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp end={longestStreak} />
						</p>
					</div>
				</div>

				<div className="flex gap-4">
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Wins</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp end={wins} />
						</p>
					</div>
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Losses</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp end={losses} />
						</p>
					</div>
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Draws</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp end={draws} />
						</p>
					</div>
				</div>

				<ChartCardWrapper>
					<p className="text-xl text-white/60 font-bold">Time Spent on Platform</p>
					{timeSpentToShow.length === 0 ? 
						<div className="flex flex-col justify-center items-center w-full h-full gap-2 grow-1">
							<Image
								src={'/meme/thinking.gif'}
								width={360}
								height={360}
								alt="No data available"
								className="rounded-2xl blur-[1.25px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
								draggable={false}
							>
							</Image>
							<h1 className="text-white/60">No data available</h1>
						</div>
						:
						<Chart data={timeSpentToShow} dataKey='timeSpent' unit='Minutes'/>
					}
				</ChartCardWrapper>
			</div>
		</MainCardWithHeader>
	);
}
