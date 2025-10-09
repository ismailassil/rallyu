import CountUp from "react-countup";
import MainCardWithHeader from "@/app/(onsite)/components/UI/MainCardWithHeader";
import ChartCardWrapper from "../../../performance/components/Charts/ChartCardWrapper";
import CustomAreaChart from "../../../performance/components/Charts/CustomAreaChart";
import { secondsToHMS } from "@/app/(api)/utils";

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
	const timeSpentToShow = timeSpent.map((item) => ({ date: item.day, value: item.total_duration }));

	return (
		<MainCardWithHeader headerName='Performance' color='notwhite' className='font-funnel-display flex-3'>
			<div className="group flex flex-col gap-4 px-6">
				<div className="profile-inner-stat-card">
					<p className="text-2xl text-white/60 font-bold">Total XP</p>
					<p className="text-3xl text-white/80 font-bold">
						<CountUp 
							end={totalXP} 
							suffix={' XP'} 
							duration={5} 
							useEasing={true} 
						/>
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
							<CountUp 
								end={totalMatches} 
								duration={5} 
								useEasing={true} 
							/>
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
							<CountUp 
								end={longestStreak} 
								duration={5} 
								useEasing={true} 
							/>
						</p>
					</div>
				</div>

				<div className="flex gap-4">
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Wins</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp 
								end={wins} 
								duration={5} 
								useEasing={true} 
							/>
						</p>
					</div>
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Losses</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp 
								end={losses} 
								duration={5} 
								useEasing={true} 
							/>
						</p>
					</div>
					<div className="profile-inner-stat-card">
						<p className="text-lg text-white/60 font-bold">Draws</p>
						<p className="text-3xl text-white/80 font-bold">
							<CountUp 
								end={draws} 
								duration={5} 
								useEasing={true} 
							/>
						</p>
					</div>
				</div>

				<ChartCardWrapper
					chartTitle='Time Spent in the Platform'
					className='h-101'
					isEmpty={timeSpentToShow.length === 0}
				>
					<CustomAreaChart data={timeSpentToShow} dataKeyX='date' dataKeyY='value' tooltipFormatter={secondsToHMS} />
				</ChartCardWrapper>
			</div>
		</MainCardWithHeader>
	);
}
