import funnelDisplay from "@/app/fonts/FunnelDisplay";
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
		<MainCardWithHeader headerName='Performance' className='font-funnel-display flex-3'>
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

				<ChartCardWrapper className="">
					{timeSpentToShow.length === 0 ? 
						<div className="flex flex-col justify-center items-center w-full h-full gap-2">
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
	return (
		<div className="flex-3 min-h-130 max-h-220 flex h-full w-full flex-col gap-4">
			<section className={`bg-card border-br-card h-full w-full flex-1 rounded-2xl border-1 select-none`}>
				<div className="flex h-full flex-col">
					<div className="group relative shrink-0 overflow-hidden">
						<h1 className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}>
							Performance
						</h1>
						<div
							className="w-18 h-5 absolute
									left-0 top-[calc(51%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0]
									transition-all duration-200 group-hover:scale-105"
						></div>
					</div>
					<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
						<div className={`pl-8 pr-8 flex h-full flex-col gap-4 pb-4 ${funnelDisplay.className}`}>
							<div
								className="bg-white/4 border border-white/10 hover:scale-101 rounded-2xl pl-4 pr-4 pt-2 pb-2
											flex flex-row items-center justify-between backdrop-blur-xl
											lg:flex-row transition-transform duration-200 hover:bg-white/6"
							>
								<p className="text-2xl text-white/60 font-bold">Total XP</p>
								<p className="text-3xl text-white/80 font-bold">
									<CountUp end={totalXP} /> XP
								</p>
							</div>
							
							<div className="flex w-full gap-3 text-center">
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
											duration-200
											sm:flex-row sm:justify-between hover:bg-white/6
										"
								>
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
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6
									"
								>
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


							<div className="flex w-full gap-3 text-center ">
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6"
								>
									<p className="text-lg text-white/60 font-bold">Wins</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={wins} />
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6
									"
								>
									<p className="text-lg text-white/60 font-bold">Losses</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={losses} />
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between
									"
								>
									<p className="text-lg text-white/60 font-bold">Draws</p>
									<p className="text-3xl text-white/80 font-bold">
										<CountUp end={draws} />
									</p>
								</div>
							</div>

							<div
								className="jusitfy-between bg-white/4 border border-white/10 min-h-70 hover:scale-101 flex h-full
										w-full flex-1 flex-col items-center backdrop-blur-xl
										gap-3 overflow-hidden rounded-2xl pt-5 transition-all duration-200 hover:bg-white/6"
							>
								<p className="text-xl text-white/60 font-bold">Time Spent on Platform</p>
								<div className="relative h-full w-full">
									{timeSpentToShow.length === 0 ? 
										<div className="flex flex-col justify-center items-center w-full h-full gap-2">
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
