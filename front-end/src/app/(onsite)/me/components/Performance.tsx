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
		<div className="flex-3 min-h-130 max-h-220 flex h-full w-full flex-col gap-4">
			<section
				className={`bg-card border-br-card h-full w-full flex-1 rounded-lg border-2`}
			>
				<div className="flex h-full flex-col">
					<div className="group relative shrink-0 overflow-hidden">
						<h1
							className={`${unicaOne.className} p-13 select-none text-4xl capitalize`}
						>
							Performance
						</h1>
						<div
							className="w-18 h-18 absolute
									-left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#E0E0E0]
									transition-all duration-200 group-hover:scale-105"
						></div>
					</div>
					<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
						<div
							className={`pl-13 pr-13 flex h-full flex-col gap-4 pb-4 ${unicaOne.className}`}
						>
							<div
								className="bg-card border-br-card hover:scale-101 min-h-22 flex items-end
									justify-between overflow-auto rounded-2xl border-2 p-6 py-5 pb-2
									transition-transform duration-200"
							>
								<p className="text-xl lg:text-2xl ">Total XP</p>
								<div className="flex items-end gap-2">
									<p className="text-4xl lg:text-5xl">
										54 895
									</p>
									<p className="text-xl lg:text-2xl">XP</p>
								</div>
							</div>
							<div className="flex w-full gap-4 text-center">
								<div
									className="bg-card border-br-card hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl border-2 p-5 py-2 transition-transform
											duration-200
										"
								>
									<p className="text-xl lg:text-2xl">
										Global Rank
									</p>
									<p className="text-4xl lg:text-5xl">3</p>
								</div>
								<div
									className="bg-card border-br-card hover:scale-101 flex max-w-[50%]
											flex-1 flex-col items-center justify-center overflow-auto rounded-2xl border-2 p-5 py-2
											transition-transform duration-200
										"
								>
									<p className="text-xl lg:text-2xl">
										Games Played
									</p>
									<p className="truncate text-4xl lg:text-5xl">
										65
									</p>
								</div>
							</div>
							<div className="flex w-full gap-4 text-center ">
								<div
									className="bg-card border-br-card hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl border-2 p-5 py-2 transition-transform
											duration-200
										"
								>
									<p className="text-xl lg:text-2xl">
										Ping Pong Games
									</p>
									<p className="text-4xl lg:text-5xl">49</p>
								</div>
								<div
									className="bg-card border-br-card hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl border-2 p-5 py-2 transition-transform
											duration-200
										"
								>
									<p className="text-xl lg:text-2xl">
										TIC TAC TOE Games
									</p>
									<p className="text-4xl lg:text-5xl">16</p>
								</div>
							</div>
							<div
								className="jusitfy-between bg-card border-br-card min-h-70 hover:scale-101 flex max-h-80
										w-full flex-1 flex-col items-center
										gap-3 overflow-hidden rounded-2xl border-2 pt-5 transition-transform duration-200"
							>
								<p className="text-xl lg:text-2xl">
									Time Spent on Platform
								</p>
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
