/* eslint-disable @typescript-eslint/no-unused-vars */
import MainCardWithHeader from "@/app/(onsite)/components/UI/MainCardWithHeader";
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import Image from "next/image";
import GameCard, { GameProps } from "./GameCard";
import { motion } from "framer-motion";

function NoGameHistoryData() {
	return (
		<MainCardWithHeader headerName='Games History' color='blue-500' className='font-funnel-display flex-3'>
			<div className="flex flex-col justify-center items-center h-80 lg:h-150 select-none">
				<Image
					src={'/meme/sad.png'}
					width={150}
					height={150}
					alt="No data available"
					className="rounded-2xl  blur-[0.75px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
					draggable={false}
					>
				</Image>
				<h1 className="text-white/60">No data available</h1>
			</div>
		</MainCardWithHeader>
	);
}

export default function GamesHistoryCard({ matches } : { matches: GameProps[] }) {
	if (matches.length === 0) {
		return <NoGameHistoryData />;
	}

	return (
		<MainCardWithHeader headerName='Games History' color='blue-500' className='font-funnel-display flex-3'>
			{/* Games List */}
			<div className="group flex flex-col gap-4 px-6">
				{matches.map((match, i) => (
					<motion.div
						key={match.match_id}
						initial={{ opacity: 0, y: -40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: i * 0.15 }}
						style={{ zIndex: matches.length - i }}
						className='bg-red-500/0'
					>
						<GameCard
							key={match.match_id}
							match_id={match.match_id}
							game_type={match.game_type}
							started_at={match.started_at}
							finished_at={match.finished_at}
							user_id={match.user_id}
							user_username={match.user_username}
							user_avatar_url={match.user_avatar_url}
							user_score={match.user_score}
							opp_score={match.opp_score}
							opponent_id={match.opponent_id}
							opponent_username={match.opponent_username}
							opponent_avatar_url={match.opponent_avatar_url}
							duration={match.duration}
							outcome={match.outcome}
						/>
					</motion.div>
				))}
			</div>
		</MainCardWithHeader>
	);
}
