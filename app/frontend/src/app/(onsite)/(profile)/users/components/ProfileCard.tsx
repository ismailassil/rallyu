import Relations, { FriendshipStatus } from './Relations';
import MainCardWrapper from '@/app/(onsite)/(refactoredUIComponents)/MainCardWrapper';
import Button from './Button';
import { LocalUserPencilIcon } from './LocalIcon';
import Avatar from './Avatar';

type ProfileCardProps = {
	userId: number,
	fullName: string,
	username: string,
	bio: string,
	avatar: string,
	friendshipStatus: string | null,
	level: number,
	globalRank: number,
	winRate: number,
	currentStreak: number
};

export default function ProfileCard({ userId, fullName, username, bio, avatar, friendshipStatus, level, globalRank, winRate, currentStreak } : ProfileCardProps) {
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
						{/* Relations Buttons */}
						{friendshipStatus && <Relations userId={userId} currentStatus={friendshipStatus as FriendshipStatus} />}
						{/* Edit Profile Button */}
						{!friendshipStatus && <a className='flex gap-3' href='/settings'><Button key="edit" text="Edit Profile" icon={LocalUserPencilIcon} /></a>}
					</div>
					{/* Avatar */}
					<Avatar 
						avatar={avatar}
						width={100}
						height={100}
						className='ring-4 hover:ring-3 aspect-square h-24 sm:h-36 lg:h-48 self-start sm:self-center
						overflow-hidden rounded-full relative
						ring-white/10 transition-all duration-500 hover:scale-105 hover:ring-white/30'
					/>
				</div>
				{/* Level Bar */}
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

			{/* Right Section (Stats) */}
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
