"use client";

import unicaOne from "@/app/fonts/unicaOne";
import Game from "./Game";

export default function GamesHistory() {
	return (
		<aside
			className={`bg-card border-2 border-br-card rounded-lg flex-[2.5] w-full h-full min-w-[30%]`}
		>
			<div className="flex flex-col h-full">
				<div className="relative overflow-hidden group shrink-0">
					<h1
						className={`${unicaOne.className} text-4xl p-13 capitalize select-none`}
					>
						Games History
					</h1>
					<div
						className="absolute top-[calc(50%)] -left-4
								-translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-lg bg-main
								duration-200 transition-all group-hover:scale-105"
					></div>
				</div>
				<div className="overflow-y-auto flex-1 max-h-[calc(100vh-19rem)] hide-scrollbar mb-4">
					<div className="flex flex-col gap-y-2.5 pl-4 pr-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<Game
								key={i}
								opponent="Nabil Azouz"
								myName="Ismail Assil"
								type={i % 2 ? "xo" : undefined}
								score={{
									me: i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 5,
									opponent: i % 3 === 0 ? 2 : i % 3 === 1 ? 5 : 5,
								}}
								opponentImage="/image_1.jpg"
								myImage="/image.png"
								matchxp={i % 3 === 0 ? 0 : i % 2 ? -50 : 100}
							/>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
