'use client';
import Relations, { FriendshipStatus } from './Relations';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import Button from './Button';
import { LocalUserPencilIcon } from './LocalIcon';
import Avatar from '../Avatar';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useIsOnline from '@/app/hooks/useIsOnline';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { useEffect, useState } from 'react';

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
	const t = useTranslations('profile');
	const router = useRouter();
	const [friendshipCurrentStatus, setCurrentFriendshipStatus] = useState(friendshipStatus);
	const isOnline = useIsOnline(userId);

	const {
		loggedInUser,
		socket
	} = useAuth();

	useEffect(() => {
		if (!loggedInUser || loggedInUser.id === userId)
			return ;

		function handleRelationUpdate(event: { eventType: string, data: Record<string, any> }) {
			console.group('/********** RELATION UPDATE **********/');

			console.log('EVENT: ', event);

			if (event.eventType !== 'RELATION_UPDATE')
				return ;
			console.log('loggedInUserId', loggedInUser?.id);
			if (event.data.status === 'BLOCKED' && event.data.receiverId === loggedInUser?.id) {
				router.push('/404');
				console.groupEnd();
				return ;
			}
			setCurrentFriendshipStatus(event.data.status);

			console.groupEnd();
		}

		socket.on('user', handleRelationUpdate);

		return () => {
			socket.off('user', handleRelationUpdate);
		};
	}, [loggedInUser, router, socket, userId]);

	const showOnline = friendshipCurrentStatus === 'FRIENDS';

	return (
		<MainCardWrapper className='flex flex-col items-center gap-8
									p-10 min-h-[300px] max-h-[500px]
									font-funnel-display
									lg:gap-12
									lg:flex-row
									md:min-h-90'
		>
			{/* LEFT SECTION */}
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
						{/* RELATIONS BUTTONS */}
						{/* EDIT PROFILE/VIEW PERFORMANCE BUTTON */}
						{friendshipStatus ? (
							<Relations
								username={username}
								userId={userId}
								currentStatus={friendshipCurrentStatus as FriendshipStatus}
							/>
						) : (
							<div className='flex flex-col sm:flex-row gap-3'>
								<Button key="edit-profile" text={t('buttons.edit_profile')} icon={LocalUserPencilIcon} onClick={() => router.push('/settings')} />
								<Button key="view-stats" text={t('buttons.view_performance')} lucide_icon={<TrendingUp size={16} />} onClick={() => router.push('/performance')} />
							</div>
						)}
					</div>
					{/* Avatar with online status */}
					<div className='relative'>
						<Avatar
							avatar={avatar}
							className='ring-3 aspect-square h-24 sm:h-36 lg:h-48 self-start sm:self-center
							overflow-hidden rounded-full relative
							ring-white/10 transition-all duration-500 hover:scale-101 hover:ring-white/20'
						/>
						{showOnline && (
							<div className="absolute bottom-[8%] right-[9%] group/status h-[12%] w-[12%] hover:w-[78px] flex items-center bg-white/20 rounded-full p-[2.5px] hover:p-[8px] hover:bg-gray-700/90 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer select-none">
								<div className={`h-full aspect-square rounded-full flex-shrink-0 transition-all duration-1000 ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
								<span className="ml-2 whitespace-nowrap font-bold text-white text-sm opacity-0 group-hover/status:opacity-100 transition-opacity duration-500 ease-in-out">
									{isOnline ? t('common.online') : t('common.offline')}
								</span>
							</div>
						)}
					</div>
				</div>
				{/* Level Bar */}
				<div className="flex h-[16%] w-full flex-col justify-end">
					<div>
						<div className="flex h-full flex-col gap-1">
							<div className="flex justify-between">
								<p className="font-semibold">{t('common.level')} {Math.floor(level)}</p>
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
						{t('cards.global_rank.part1')}
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						{t('cards.global_rank.part2')}
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>#{globalRank}</span>
				</div>
				<div className='profile-inner-stat-card flex-1'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						{t('cards.win_rate.part1')}
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						{t('cards.win_rate.part2')}
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{winRate.toFixed(2)}%</span>
				</div>
				<div className='profile-inner-stat-card flex-1'>
					<span className='text-lg lg:text-xl font-semibold text-white/60 text-center lg:text-start'>
						{t('cards.current_streak.part1')}
						<span className="inline"> </span>
						<span className="inline md:hidden lg:inline"><br /></span>
						{t('cards.current_streak.part2')}
					</span>
					<span className='text-xl lg:text-3xl font-bold text-white/90 text-center lg:text-start'>{currentStreak} {currentStreak ? '🔥' : ''}</span>
				</div>
			</div>
		</MainCardWrapper>
	);
}
