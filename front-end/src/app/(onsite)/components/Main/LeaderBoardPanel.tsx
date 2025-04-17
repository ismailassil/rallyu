import unicaOne from "@/app/fonts/unicaOne";
import LeaderboardItem from "./LeaderBoardItem";
import { useState } from "react";
import useIsWidth from "../useIsWidth";

export default function LeaderboardPanel() {
	const isWidth = useIsWidth(1024);
	const [showbox, setShowbox] = useState(false);

	return (
		<aside
			className={`bg-card border-br-card h-full w-full flex-1 rounded-lg border-2 ${
				isWidth
					? !showbox
						? "min-h-[588px] cursor-pointer"
						: "min-h-37 max-h-37 cursor-pointer"
					: "max-h-[948px] min-h-[588px]"
			}`}
		>
			<div className="flex h-full flex-col">
				<div className="group relative shrink-0 overflow-hidden" onClick={() => setShowbox(!showbox)}>
					<h1 className={`${unicaOne.className} p-13 select-none text-4xl uppercase`}>Leaderboard</h1>
					<div
						className="w-18 h-18 bg-accent
					absolute -left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
					transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
				<div className={`custom-scroll flex-1 overflow-y-auto ${showbox && "hidden lg:block"}`}>
					<div className="flex flex-col gap-y-2 pb-4 pl-4 pr-4">
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
