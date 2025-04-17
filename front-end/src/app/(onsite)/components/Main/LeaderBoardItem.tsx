import { CastleTurret, Crown, CrownSimple } from "@phosphor-icons/react";
import Image from "next/image";

interface LeaderboardProps {
	username: string;
	rank: number;
	score: number;
	img: string;
	position: number;
}

export default function LeaderboardItem({ username, rank, score, img, position }: LeaderboardProps) {
	return (
		<div
			className="bg-card border-br-card hover:bg-hbg hover:border-hbbg hover:scale-101 group
				flex items-center overflow-hidden rounded-xl border-2
				p-3 transition-transform duration-500 hover:cursor-pointer"
		>
			{/* Rank Badge */}
			<div
				className="flex h-[38px] w-[38px] items-center justify-center
					rounded-full  text-xl font-bold text-white group-hover:text-2xl
					lg:h-[40px] lg:w-[40px]"
			>
				{position === 0 && <Crown color="oklch(82.8% 0.189 84.429)" size={32} />}
				{position === 1 && <CrownSimple color="oklch(82.8% 0.189 84.429)" size={32} />}
				{position === 2 && <CastleTurret color="oklch(82.8% 0.189 84.429)" size={32} />}
				{position > 2 && rank}
			</div>

			{/* Profile Image */}
			<div className="ml-3 flex aspect-square h-[45px] w-[45px] justify-center rounded-full lg:h-[55px] lg:w-[55px]">
				<Image
					className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-wrap text-base capitalize lg:text-lg">{username}</h2>
				<p className="text-sm text-gray-500 lg:text-base">
					Score: <span className="font-semibold text-yellow-400">{score}</span>
				</p>
			</div>
		</div>
	);
}
