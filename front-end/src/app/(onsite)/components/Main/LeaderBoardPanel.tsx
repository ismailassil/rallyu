import unicaOne from "@/app/fonts/unicaOne";
import LeaderboardItem from "./LeaderBoardItem";
import { useState } from "react";

export default function LeaderboardPanel() {
	const [leaderboard, setLeaderboard] = useState(false);

	return (
		<aside
			className={`bg-card border-2 border-br-card rounded-lg flex-1 w-full h-full max-h-[948px] ${!leaderboard && "min-h-[588px]"}`}
		>
			<div className="flex flex-col h-full">
				<div
					className="relative overflow-hidden group shrink-0"
					onClick={() => setLeaderboard(!leaderboard)}
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
					className={`overflow-y-auto flex-1 hide-scrollbar ${leaderboard && "hidden lg:block"}`}
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
		username: "GamingLegend",
		rank: 1,
		score: 9850,
		img: "/image_1.jpg",
	},
	{
		username: "ProPlayer99",
		rank: 2,
		score: 9720,
		img: "/image_2.jpg",
	},
	{
		username: "Salah Demnati",
		rank: 3,
		score: 9450,
		img: "/image_2.jpg",
	},
	{
		username: "EpicGamer",
		rank: 4,
		score: 9210,
		img: "/image_1.jpg",
	},
	{
		username: "GameMaster",
		rank: 5,
		score: 8940,
		img: "/image_2.jpg",
	},
];

// Generate additional sample data
const extendedLeaderboard = [
	...leaderboardData,
	...Array.from({ length: 50 }).map((_, i) => ({
		username: `Player${i + 6}`,
		rank: i + 6,
		score: 8900 - i * 50,
		img: "/image_2.jpg",
	})),
];
