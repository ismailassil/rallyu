import unicaOne from "@/app/fonts/unicaOne";
import LeaderboardItem from "./LeaderBoardItem";
import { useState } from "react";
import useIsWidth from "../useIsWidth";

export default function LeaderboardPanel() {
	const isWidth = useIsWidth(1024);
	const [showbox, setShowbox] = useState(false);

	return (
		<aside
			className={`bg-card border-2 border-br-card rounded-lg flex-1 w-full h-full ${
				isWidth
					? !showbox
						? "min-h-[588px]"
						: "min-h-37 max-h-37"
					: "max-h-[948px] min-h-[588px]"
			}`}
			//
		>
			<div className="flex flex-col h-full">
				<div
					className="relative overflow-hidden group shrink-0"
					onClick={() => setShowbox(!showbox)}
				>
					<h1
						className={`${unicaOne.className} text-4xl p-13 uppercase select-none`}
					>
						Leaderboard
					</h1>
					<div
						className="absolute top-[calc(50%)] -left-4
					-translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-lg bg-accent
					duration-200 transition-all group-hover:scale-105"
					></div>
				</div>
				<div
					className={`overflow-y-auto flex-1 hide-scrollbar ${
						showbox && "hidden lg:block"
					}`}
				>
					<div className="flex flex-col gap-y-2 pl-4 pr-4 pb-4 overflow-auto">
						{extendedLeaderboard.map((player, i) => (
							<LeaderboardItem
								position={i}
								key={i}
								img={player.img}
								username={player.username}
								rank={player.rank}
								score={player.score}
							/>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}

const leaderboardData = [
	{
		username: "Rass L7ok",
		rank: 1,
		score: 9850,
		img: "/image_1.jpg",
	},
	{
		username: "Lmouch",
		rank: 2,
		score: 9720,
		img: "/image_2.jpg",
	},
	{
		username: "Moul Chi",
		rank: 3,
		score: 9450,
		img: "/image_1.jpg",
	},
];

// Generate additional sample data
const extendedLeaderboard = [
	...leaderboardData,
	...Array.from({ length: 6 }).map((_, i) => ({
		username: `Player ${i + 6}`,
		rank: i + 5,
		score: 8500 - i * 100,
		img: `/image_${(i % 2) + 1}.jpg`,
	})),
];
