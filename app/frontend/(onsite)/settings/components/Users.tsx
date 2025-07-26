import React from 'react';
import SettingsCard from './SettingsCard';
import { motion } from 'framer-motion';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import Image from 'next/image';
import { CircleMinus, Clock, UserMinus } from 'lucide-react';

const blockedUsers = [
	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', blockedSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', blockedSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', blockedSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', blockedSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', blockedSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', blockedSince: '2 months' },
];

const friendsList = [
	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', friendsSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', friendsSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', friendsSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', friendsSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', friendsSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', friendsSince: '2 months' },
];

const outgoingRequests = [
	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', outgoingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', outgoingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', outgoingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', outgoingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', outgoingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', outgoingSince: '2 months' },
];

const incomingRequests = [
	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', incomingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', incomingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', incomingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', incomingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', incomingSince: '2 months' },
	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', incomingSince: '2 months' },
];

function BlockedUsers() {
	return (
		<div className='grid grid-cols-2 px-18 gap-3'>
			{blockedUsers.map(({ avatar, fullName, blockedSince }) => (
				<div
					key={fullName}
					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
						flex justify-between items-center py-3 px-5`}
				>
					<div className='flex gap-3 items-center'>
						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
							<Image
								src={avatar}
								alt="Profile Image"
								width={96}
								height={96}
								className="h-full w-full object-cover rounded-full"
								quality={100}
							/>
						</div>
						<div>
							<h1>
								{fullName}
							</h1>
							<p className='text-sm flex items-center gap-1 text-white/70'>
								<Clock size={14}/>
								{blockedSince}
							</p>
						</div>
					</div>
					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
				</div>
			))}
		</div>
	);
}

function FriendsList() {
	return (
		<div className='grid grid-cols-2 px-18 gap-3'>
			{friendsList.map(({ avatar, fullName, friendsSince }) => (
				<div
					key={fullName}
					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
						flex justify-between items-center py-3 px-5`}
				>
					<div className='flex gap-3 items-center'>
						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
							<Image
								src={avatar}
								alt="Profile Image"
								width={96}
								height={96}
								className="h-full w-full object-cover rounded-full"
								quality={100}
							/>
						</div>
						<div>
							<h1>
								{fullName}
							</h1>
							<p className='text-sm flex items-center gap-1 text-white/70'>
								<Clock size={14}/>
								{friendsSince}
							</p>
						</div>
					</div>
					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
				</div>
			))}
		</div>
	);
}

function OutgoingFriendRequests() {
	return (
		<div className='grid grid-cols-2 px-18 gap-3'>
			{outgoingRequests.map(({ avatar, fullName, outgoingSince }) => (
				<div
					key={fullName}
					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
						flex justify-between items-center py-3 px-5`}
				>
					<div className='flex gap-3 items-center'>
						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
							<Image
								src={avatar}
								alt="Profile Image"
								width={96}
								height={96}
								className="h-full w-full object-cover rounded-full"
								quality={100}
							/>
						</div>
						<div>
							<h1>
								{fullName}
							</h1>
							<p className='text-sm flex items-center gap-1 text-white/70'>
								<Clock size={14}/>
								{outgoingSince}
							</p>
						</div>
					</div>
					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
				</div>
			))}
		</div>
	);
}

function IncomingFriendRequests() {
	return (
		<div className='grid grid-cols-2 px-18 gap-3'>
			{incomingRequests.map(({ avatar, fullName, incomingSince }) => (
				<div
					key={fullName}
					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
						flex justify-between items-center py-3 px-5`}
				>
					<div className='flex gap-3 items-center'>
						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
							<Image
								src={avatar}
								alt="Profile Image"
								width={96}
								height={96}
								className="h-full w-full object-cover rounded-full"
								quality={100}
							/>
						</div>
						<div>
							<h1>
								{fullName}
							</h1>
							<p className='text-sm flex items-center gap-1 text-white/70'>
								<Clock size={14}/>
								{incomingSince}
							</p>
						</div>
					</div>
					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
				</div>
			))}
		</div>
	);
}

export default function Users() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, delay: 0 }}
		>
			<div className='flex flex-col gap-4'>
				<SettingsCard 
					title="Blocked Users"
					subtitle="View and unblock all the users you have blocked"
				>
					<BlockedUsers />
				</SettingsCard>

				<SettingsCard 
					title="Friends"
					subtitle="View and unfriend all of your friends"
				>
					<FriendsList />
				</SettingsCard>

				<SettingsCard 
					title="Outgoing Friend Requests"
					subtitle="View and cancel all the pending friend request you've sent"
				>
					<OutgoingFriendRequests />
				</SettingsCard>

				<SettingsCard 
					title="Incoming Friend Requests"
					subtitle="View and decline all the pending friend request you've received"
				>
					<IncomingFriendRequests />
				</SettingsCard>

				{/* <div className="flex flex-col gap-5 px-18 mt-8 mb-4">
					<h1>Language</h1>
					<h1>Notifications</h1>
				</div> */}
			</div>
		</motion.div>
	);
}
