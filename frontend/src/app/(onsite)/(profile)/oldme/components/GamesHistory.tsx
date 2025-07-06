"use client";

import unicaOne from "@/app/fonts/unicaOne";
import Game from "./Game";
import { IGameHistory } from "../page";

export default function GamesHistory({ userGames } : { userGames: Array<IGameHistory> }) {
	return (
		<aside
			className={`bg-card border-br-card min-h-130 max-h-220 h-full w-full min-w-[30%] flex-[2.5] rounded-lg border-2`}
		>
			<div className="flex h-full flex-col">
				<div className="group relative shrink-0 overflow-hidden">
					<h1 className={`${unicaOne.className} p-13 select-none text-4xl capitalize`}>
						Games History
					</h1>
					<div
						className="w-18 h-18 bg-main
								absolute -left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
								transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
				<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
					<div className="flex flex-col gap-y-2.5 pl-4 pr-4">
						{/* {Array.from({ length: 10 }).map((_, i) => (
							<Game
								key={i}
								opponent="Nabil Azouz"
								myName="Ismail Assil"
								type={i % 2 ? "xo" : undefined}
								score={{
									me: i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 5,
									opponent: i % 3 === 0 ? 2 : i % 3 === 1 ? 5 : 5,
								}}
								opponentImage="/profile/image_1.jpg"
								myImage="/profile/image.png"
								matchxp={i % 3 === 0 ? 0 : i % 2 ? -50 : 100}
							/>
						))} */}
						{userGames.map((game, index) => (
							<Game key={index} gameInfo={game} />
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
