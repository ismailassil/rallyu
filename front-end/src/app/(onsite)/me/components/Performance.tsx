"use client";

import unicaOne from "@/app/fonts/unicaOne";
import Chart from "./Chart";

const data = [
	{ date: "2023-01-01", timeSpent: 5 },
	{ date: "2023-01-02", timeSpent: 19 },
	{ date: "2023-01-03", timeSpent: 10 },
	{ date: "2023-01-03", timeSpent: 14 },
	{ date: "2023-01-04", timeSpent: 16 },
	{ date: "2023-01-05", timeSpent: 6 },
	{ date: "2023-01-06", timeSpent: 16 },
	{ date: "2023-01-07", timeSpent: 3 },
];

export default function Performance() {
	return (
		<div className="flex flex-col gap-4 h-full flex-3 w-full min-h-130 max-h-220">
			<section
				className={`bg-card border-2 border-br-card rounded-lg flex-1 w-full h-full`}
			>
				<div className="flex flex-col h-full">
					<div className="relative overflow-hidden group shrink-0">
						<h1
							className={`${unicaOne.className} text-4xl p-13 capitalize select-none`}
						>
							Performance
						</h1>
						<div
							className="absolute top-[calc(50%)] -left-4
									-translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-lg bg-[#E0E0E0]
									duration-200 transition-all group-hover:scale-105"
						></div>
					</div>
					<div className="overflow-y-auto flex-1 max-h-[calc(100vh-19rem)] hide-scrollbar mb-4">
						<div
							className={`flex flex-col gap-4 pl-13 pr-13 pb-4 h-full ${unicaOne.className}`}
						>
							<div
								className="flex justify-between items-end p-6 py-5 pb-2
									bg-card border-2 border-br-card rounded-2xl transition-transform duration-200 hover:scale-101
									overflow-auto min-h-22"
							>
								<p className="text-xl lg:text-2xl ">Total XP</p>
								<div className="flex gap-2 items-end">
									<p className="text-4xl lg:text-5xl">54 895</p>
									<p className="text-xl lg:text-2xl">XP</p>
								</div>
							</div>
							<div className="flex gap-4 w-full text-center">
								<div
									className="flex-1 bg-card border-2 border-br-card rounded-2xl
											flex flex-col items-center justify-center p-5 py-2 hover:scale-101 transition-transform duration-200
											overflow-auto
										"
								>
									<p className="text-xl lg:text-2xl">Global Rank</p>
									<p className="text-4xl lg:text-5xl">3</p>
								</div>
								<div
									className="flex-1 bg-card border-2 border-br-card rounded-2xl
											flex flex-col items-center justify-center p-5 py-2 hover:scale-101 transition-transform duration-200
											max-w-[50%] overflow-auto
										"
								>
									<p className="text-xl lg:text-2xl">Games Played</p>
									<p className="text-4xl lg:text-5xl truncate">65</p>
								</div>
							</div>
							<div className="flex gap-4 w-full text-center ">
								<div
									className="flex-1 bg-card border-2 border-br-card rounded-2xl
											flex flex-col items-center justify-center p-5 py-2 hover:scale-101 transition-transform duration-200
											overflow-auto
										"
								>
									<p className="text-xl lg:text-2xl">Ping Pong Games</p>
									<p className="text-4xl lg:text-5xl">49</p>
								</div>
								<div
									className="flex-1 bg-card border-2 border-br-card rounded-2xl
											flex flex-col items-center justify-center p-5 py-2 hover:scale-101 transition-transform duration-200
											overflow-auto
										"
								>
									<p className="text-xl lg:text-2xl">TIC TAC TOE Games</p>
									<p className="text-4xl lg:text-5xl">16</p>
								</div>
							</div>
							<div
								className="flex-1 pt-5 flex flex-col items-center jusitfy-between gap-3
										bg-card border-2 border-br-card rounded-2xl
										min-h-70 max-h-80 w-full overflow-hidden hover:scale-101 transition-transform duration-200"
							>
								<p className="text-xl lg:text-2xl">Time Spent on Platform</p>
								<div className="relative h-full w-full">
									<Chart data={data} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
