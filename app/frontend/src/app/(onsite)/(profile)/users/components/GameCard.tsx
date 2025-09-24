import Image from "next/image";
import Avatar from "./Avatar";


export type GameProps = {
	match_id: number,
    game_type: string,
    started_at: string,
    finished_at: string,
    user_id: number,
    user_username: string,
	user_avatar_url: string,
    user_score: number,
    opp_score: number,
    opponent_id: number,
    opponent_username: string,
	opponent_avatar_url: string,
    duration: number,
    outcome: string
}

type Outcome = 'W' | 'L' | 'D';

const outcomeStyles: Record<Outcome, { bg: string; ring: string; label: string }> = {
	W: { bg: 'bg-green-600', ring: 'ring-3 ring-green-500', label: 'Victory' },
	L: { bg: 'bg-red-600', ring: 'ring-3 ring-red-500', label: 'Defeat' },
	D: { bg: 'bg-gray-600', ring: 'ring-3 ring-gray-500', label: 'Draw' },
};

function PlayerAvatar({ avatar, ringClass } : { avatar: string; ringClass: string; }) {
	return (
		<div className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full lg:h-[45px] lg:w-[45px]">
			<Avatar avatar={avatar} width={100} height={100} className={`overflow-hidden rounded-full ${ringClass}`} />
		</div>
	);
}

export default function GameCard({
	// match_id,
	game_type,
	// started_at,
	// finished_at,
	// user_id,
	user_username,
	user_avatar_url,
	user_score,
	opp_score,
	// opponent_id,
	opponent_username,
	opponent_avatar_url,
	// duration,
	outcome,
} : GameProps) {
	const outcomeStyle = outcomeStyles[outcome as Outcome];
	const opponentRingClass =
		outcome === 'W'
			? outcomeStyles['L'].ring
			: outcome === 'L'
			? outcomeStyles['W'].ring
			: outcomeStyles['D'].ring;

	return (
		<div className="single-game-history-card relative overflow-hidden">
			{/* Outcome badge */}
			<div
				className={`w-19 h-8 absolute -top-1 left-1/2 flex -translate-x-1/2 items-end justify-center pb-1 ${outcomeStyle.bg} border-1 border-gray-600 rounded-b-lg`}
			>
				<p className="text-sm">{outcomeStyle.label}</p>
			</div>

			{/* Game type icon */}
			<div className="w-19 bg-gray-thick border border-white/15 absolute -bottom-1 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-t-lg">
				<Image
					src={game_type === 'XO' ? '/icons/XO.svg' : '/icons/ping-pong.svg'}
					width={game_type === 'XO' ? 30 : 18}
					height={game_type === 'XO' ? 30 : 18}
					alt="Game Icon"
				/>
			</div>

			{/* Player info */}
			<div className="flex w-[30%] items-center gap-4">
				<PlayerAvatar avatar={user_avatar_url} ringClass={outcomeStyle.ring} />
				<p className="text-wrap truncate">{user_username}</p>
			</div>

			<p className="text-xl font-bold">{user_score}</p>

			<div className="text-sm italic text-gray-500">{outcome === 'W' ? '+50' : outcome === 'L' ? '-50' : '0'} XP</div>

			<p className="text-xl font-bold">{opp_score}</p>

			{/* Opponent info */}
			<div className="flex w-[30%] items-center justify-end gap-4">
				<p className="text-wrap truncate text-right">{opponent_username}</p>
				<PlayerAvatar avatar={opponent_avatar_url} ringClass={opponentRingClass} />
			</div>
		</div>
	);
}