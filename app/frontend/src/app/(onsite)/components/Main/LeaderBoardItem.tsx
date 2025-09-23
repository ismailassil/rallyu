import { CastleTurret, Crown, CrownSimple } from '@phosphor-icons/react';
import Image from 'next/image';

interface LeaderboardProps {
	username: string;
	rank: number;
	score: number;
	img: string;
	position: number;
}

export default function LeaderboardItem({
	username,
	rank,
	score,
	img,
	position,
}: LeaderboardProps) {
	return (
		<div
			className="bg-card border-br-card hover:bg-hbg transition-all 
				hover:border-hbbg hover:scale-101 group
				flex items-center overflow-hidden rounded-xl border-2
				p-3 duration-500 hover:cursor-pointer"
		>
			{/* Rank Badge */}
			<div
				className="flex h-[38px] w-[38px] items-center justify-center 
					duration-300 transition-all
					rounded-full text-xl font-bold text-white
					lg:h-[40px] lg:w-[40px]"
			>
				{position === 0 && (
					<Crown color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position === 1 && (
					<CrownSimple color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position === 2 && (
					<CastleTurret color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position > 2 && rank}
			</div>

			{/* Profile Image */}
			<div className="ml-3 flex aspect-square h-[40px] w-[40px] justify-center 
					rounded-full lg:h-[45px] lg:w-[45px]">
				<Image
					className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow flex justify-between items-center">
				<h2 className="text-wrap text-base lg:text-lg">
					{username}
				</h2>
				<p className="text-sm text-gray-400 bg-white/7 p-2 
					rounded-lg ring-1 ring-white/15 text-end"
				>
					<span className="font-semibold text-yellow-400">{score}</span>{' '}XP
				</p>
			</div>
		</div>
	);
}
