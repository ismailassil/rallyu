import Image from 'next/image';
import Relations from './Relations';
import MainCardWrapper from '@/app/(onsite)/(refactoredUIComponents)/MainCardWrapper';

type ProfileCardProps = {
	user_id: number,
	fullName: string,
	username: string,
	bio: string,
	avatarSrc: string,
	relationStatus: string | null,
	level: number,
	globalRank: number,
	winRate: number,
	currentStreak: number
};

export default function ProfileCard({ user_id, fullName, username, bio, avatarSrc, relationStatus, level, globalRank, winRate, currentStreak } : ProfileCardProps) {
	return (
		<MainCardWrapper className='flex flex-col items-center gap-8
									p-10 min-h-[300px] max-h-[500px]
									font-funnel-display
									lg:gap-12
									lg:flex-row
									md:min-h-90'
		>
			{/* Left Section */}
			<div className="flex-3 flex h-full w-full flex-col items-center gap-4">
				<div className="flex flex-row-reverse sm:flex-row h-full w-full flex-1 items-center gap-4">
					<div className="flex-5 flex flex-col gap-4">
						<div>
							<h1 className='text-2xl lg:text-5xl text-accent font-extrabold'>
								{fullName}
							<p className='text-lg lg:text-2xl xl:text-3xl font-semibold text-white/50'>{`(${username})`}</p>
							</h1>
						</div>
						<p className={`text-sm text-gray-400 lg:text-lg`}>
							{bio}
						</p>
						{relationStatus && <Relations user_id={user_id} status={relationStatus} />}
						{!relationStatus && 
							<div className='flex gap-3 select-none'>
								<a className={`flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center 
									h-11 bg-white/4 rounded-xl border border-white/10 backdrop-blur-2xl transition-all duration-200
									hover:bg-white/6 hover:scale-102`} href='/settings'
								>
									<Image
										alt='Edit Profile'
										src='/icons/user-pencil.svg'
										height={20}
										width={20}
									>
									</Image>
									<p className='text-lg text-white/85'>Edit Profile</p>
								</a>
							</div>
						}
						
					</div>
					<div
						className="ring-4 hover:ring-3 aspect-square h-[60%] sm:h-[80%] self-start sm:self-center
							overflow-hidden rounded-full relative
							ring-white/10 transition-all duration-500 hover:scale-105 hover:ring-white/30
							"
					>
						<Image
							className={`h-full w-full object-cover`}
							// src={avatar || '/profile/image.png'}
							src={avatarSrc}
							// width={100}
							// height={100}
							// quality={100}
							fill
							alt="Profile Image"
							draggable={false}
							// unoptimized
						/>
					</div>
				</div>
				<div className="flex h-[16%] w-full flex-col justify-end">
					<div>
						<div className="flex h-full flex-col gap-1">
							<div className="flex justify-between">
								<p className="font-semibold">Level {Math.floor(level)}</p>
								<p className="text-gray-300">{Math.floor((level % 1) * 100)}%</p>
							</div>
							<div className="h-full w-full">
								<div className="bg-card h-2 w-full rounded-full">
									<div 
										className={`bg-accent h-2 rounded-full`}
										style={{ width: `${Math.floor((level % 1) * 100)}%` }}
									>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Section (stats) */}
			<div
				className={`*:hover:scale-102 *:duration-300 *:transform flex h-full w-full flex-row gap-3 lg:w-[25%] lg:flex-col  flex-1 lg:max-w-72`}
			>
				<div className='profile-inner-stat-card flex-1'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Global
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Rank
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>#{globalRank}</span>
				</div>
				<div className='profile-inner-stat-card flex-1'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Win 
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Rate
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{winRate.toFixed(2)}%</span>
				</div>
				<div className='profile-inner-stat-card flex-1'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						Current
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						Streak
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{currentStreak} {currentStreak ? '🔥' : ''}</span>
				</div>
			</div>
		</MainCardWrapper>
	);
}
