import { CastleTurretIcon, CrownSimpleIcon } from '@phosphor-icons/react';
import Avatar from '../../users/components/Avatar';
import { CrownIcon } from 'lucide-react';

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
			className="single-leaderboard-item-card"
		>
			{/* Rank Badge */}
			<div
				className="flex items-center justify-center text-xl font-bold text-notwhite text-center
					h-[40px] w-[30px] lg:h-[45px] lg:w-[35px] lg:text-2xl"
			>
				{position === 0 && (
					<CrownIcon color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position === 1 && (
					<CrownSimpleIcon color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position === 2 && (
					<CastleTurretIcon color="oklch(82.8% 0.189 84.429)" size={30} />
				)}
				{position > 2 && rank}
			</div>

			{/* Profile Image */}
			<div className="flex ring-accen ring-2 aspect-square h-[40px] w-[40px] items-center justify-center rounded-full lg:h-[45px] lg:w-[45px]">
				<Avatar avatar={img} className='h-full w-full' />
			</div>

			{/* Middle Content */}
			<div className="flex-grow flex justify-between items-center">
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
