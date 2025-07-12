"use client";

import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import ProfileCard from "./ProfileCard";
import funnelDisplay from "@/app/fonts/FunnelDisplay";

function HeroCard({ user } : { user: any }) {
	const { user: authUser } = useAuth();
	console.log('UserPanel');
	console.log('AuthUsername: ', authUser?.username);
	console.log('DynamicUsername: ', user.user.username);

	return (
		<header
			className="bg-card border-br-card flex w-full flex-col items-center gap-12
						overflow-hidden rounded-2xl border-1 p-10
						min-h-[300px] max-h-[400px]
						sm:min-h-[300px]
						md:min-h-[360px] md:max-h-[400px]
						lg:flex-row"
		>
			<ProfileCard user={user} />
			<div
				className={`*:hover:scale-102 *:duration-200 *:transform flex h-full w-full flex-row gap-3 lg:w-[25%] lg:flex-col ${funnelDisplay.className} flex-1 lg:max-w-72`}
			>
				<div className='flex-1 bg-white/4 border border-white/10 rounded-2xl pl-4 pr-4 pt-2 pb-2
								flex flex-col items-center justify-between backdrop-blur-xl
								hover:bg-white/6
								lg:flex-row'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Global
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Rank
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>#{1 || user.stats.user.rank}</span>
				</div>
				<div className='flex-1 bg-white/4 border border-white/10 rounded-2xl pl-4 pr-4 pt-2 pb-2
								flex flex-col items-center justify-between backdrop-blur-xl
								hover:bg-white/6
								lg:flex-row'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Win 
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Rate
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{user.stats.matches.win_rate.toFixed(1)}%</span>
				</div>
				<div className='flex-1 bg-white/4 border border-white/10 rounded-2xl pl-4 pr-4 pt-2 pb-2
								flex flex-col items-center justify-between backdrop-blur-xl
								hover:bg-white/6
								lg:flex-row'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Current
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Streak
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{user.stats.user.current_streak} 🔥</span>
				</div>
			</div>
		</header>
	);
}

export default HeroCard;
