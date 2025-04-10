import { CastleTurret, Crown, CrownSimple } from "@phosphor-icons/react";
import Image from "next/image";

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
		<div className="flex group bg-card border-2 hover:cursor-pointer border-br-card rounded-xl hover:bg-hbg hover:border-hbbg hover:scale-101 transition-transform duration-500 p-3 items-center overflow-hidden">
			{/* Rank Badge */}
			<div
				className="flex w-[40px] h-[40px]
					rounded-full  text-white font-bold text-xl group-hover:text-2xl
					justify-center items-center"
			>
				{position === 0 && (
					<Crown color="oklch(82.8% 0.189 84.429)" size={32} />
				)}
				{position === 1 && (
					<CrownSimple color="oklch(82.8% 0.189 84.429)" size={32} />
				)}
				{position === 2 && (
					<CastleTurret color="oklch(82.8% 0.189 84.429)" size={32} />
				)}
				{position > 2 && rank}
			</div>

			{/* Profile Image */}
			<div className="ml-3 flex w-[55px] h-[55px] rounded-full justify-center aspect-square">
				<Image
					className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-xl capitalize text-wrap">{username}</h2>
				<p className="text-gray-500">
					Score: <span className="text-yellow-400 font-semibold">{score}</span>
				</p>
			</div>
		</div>
	);
}
