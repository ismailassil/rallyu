import React, { useEffect, useState } from 'react';
import SettingsCard from '../SettingsCard';
import { motion } from 'framer-motion';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import Image from 'next/image';
import { CircleMinus, Clock } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import UserList from './UserList';
import FriendsList from './FriendsList';
import BlockedList from './BlockedList';
import OutgoingFriendRequestsList from './OutgoingFriendRequestsList';
import IncomingFriendRequestsList from './IncomingFriendRequestsList';

// const blockedUsers = [
// 	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', blockedSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', blockedSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', blockedSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', blockedSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', blockedSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', blockedSince: '2 months' },
// ];

// const friendsList = [
// 	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', friendsSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', friendsSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', friendsSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', friendsSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', friendsSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', friendsSince: '2 months' },
// ];

// const outgoingRequests = [
// 	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', outgoingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', outgoingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', outgoingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', outgoingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', outgoingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', outgoingSince: '2 months' },
// ];

// const incomingRequests = [
// 	{ avatar: '/profile/image.png', fullName: 'Hamza El Omrani', incomingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Ismail Assil', incomingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Salah Demnati', incomingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Achraf Ibn Cheikh', incomingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Med Amine Maila', incomingSince: '2 months' },
// 	{ avatar: '/profile/image.png', fullName: 'Taha Besbess', incomingSince: '2 months' },
// ];

// function BlockedUsers() {
// 	return (
// 		<div className='grid grid-cols-2 px-18 gap-3'>
// 			{blockedUsers.map(({ avatar, fullName, blockedSince }) => (
// 				<div
// 					key={fullName}
// 					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
// 						flex justify-between items-center py-3 px-5`}
// 				>
// 					<div className='flex gap-3 items-center'>
// 						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
// 							<Image
// 								src={avatar}
// 								alt="Profile Image"
// 								width={96}
// 								height={96}
// 								className="h-full w-full object-cover rounded-full"
// 								quality={100}
// 							/>
// 						</div>
// 						<div>
// 							<h1>
// 								{fullName}
// 							</h1>
// 							<p className='text-sm flex items-center gap-1 text-white/70'>
// 								<Clock size={14}/>
// 								{blockedSince}
// 							</p>
// 						</div>
// 					</div>
// 					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
// 				</div>
// 			))}
// 		</div>
// 	);
// }

// function FriendsList() {
// 	const { apiClient } = useAuth();
// 	const [friends, setFriends] = useState([]);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		// Fetch blocked users from backend on component mount
// 		async function fetchFriends() {
// 		  try {
// 			setIsLoading(true);
// 			const data = await apiClient.getAllFriends();
// 			setFriends(data);
// 		  } catch (err) {
// 			alert('Error fetching friends');
// 			alert(err);
// 		  } finally {
// 			setIsLoading(false);
// 		  }
// 		}
// 		fetchFriends();
// 	}, []);

// 	async function handleUnfriend(user_id: number) {
// 		try {
// 			await apiClient.unfriend(user_id);
// 			setFriends(prev => prev.filter(friend => friend.id !== user_id));
// 		} catch (err) {
// 			alert('Error unfriending');
// 			alert(err);
// 		}
// 	}

// 	if (isLoading)
// 		return <p>Loading friends...</p>;

// 	return (
// 		<div className='grid grid-cols-2 px-18 gap-3'>
// 			{friends.map(({ id, first_name, last_name, updated_at, avatar_url }) => (
// 				<div
// 					key={id}
// 					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
// 						flex justify-between items-center py-3 px-5`}
// 				>
// 					<div className='flex gap-3 items-center'>
// 						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
// 							<Image
// 								src={`http://localhost:4025/api${avatar_url}` || '/profile/image.png'}
// 								alt="Profile Image"
// 								width={96}
// 								height={96}
// 								className="h-full w-full object-cover rounded-full"
// 								quality={100}
// 							/>
// 						</div>
// 						<div>
// 							<h1>
// 								{first_name} {last_name}
// 							</h1>
// 							<p className='text-sm flex items-center gap-1 text-white/70'>
// 								<Clock size={14}/>
// 								{updated_at}
// 							</p>
// 						</div>
// 					</div>
// 					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} onClick={() => handleUnfriend(id)} />
// 				</div>
// 			))}
// 		</div>
// 	);
// }

// function OutgoingFriendRequests() {
// 	return (
// 		<div className='grid grid-cols-2 px-18 gap-3'>
// 			{outgoingRequests.map(({ avatar, fullName, outgoingSince }) => (
// 				<div
// 					key={fullName}
// 					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
// 						flex justify-between items-center py-3 px-5`}
// 				>
// 					<div className='flex gap-3 items-center'>
// 						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
// 							<Image
// 								src={avatar}
// 								alt="Profile Image"
// 								width={96}
// 								height={96}
// 								className="h-full w-full object-cover rounded-full"
// 								quality={100}
// 							/>
// 						</div>
// 						<div>
// 							<h1>
// 								{fullName}
// 							</h1>
// 							<p className='text-sm flex items-center gap-1 text-white/70'>
// 								<Clock size={14}/>
// 								{outgoingSince}
// 							</p>
// 						</div>
// 					</div>
// 					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
// 				</div>
// 			))}
// 		</div>
// 	);
// }

// function IncomingFriendRequests() {
// 	return (
// 		<div className='grid grid-cols-2 px-18 gap-3'>
// 			{incomingRequests.map(({ avatar, fullName, incomingSince }) => (
// 				<div
// 					key={fullName}
// 					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/10
// 						flex justify-between items-center py-3 px-5`}
// 				>
// 					<div className='flex gap-3 items-center'>
// 						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
// 							<Image
// 								src={avatar}
// 								alt="Profile Image"
// 								width={96}
// 								height={96}
// 								className="h-full w-full object-cover rounded-full"
// 								quality={100}
// 							/>
// 						</div>
// 						<div>
// 							<h1>
// 								{fullName}
// 							</h1>
// 							<p className='text-sm flex items-center gap-1 text-white/70'>
// 								<Clock size={14}/>
// 								{incomingSince}
// 							</p>
// 						</div>
// 					</div>
// 					<CircleMinus className='hover:text-red-400 cursor-pointer transition-all duration-300' size={22} />
// 				</div>
// 			))}
// 		</div>
// 	);
// }

export default function Users() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 25, scale: 0.99 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex flex-col gap-4'>
				<SettingsCard 
					title="Friends"
					subtitle="View and manage relationship with all of your friends"
					isFoldable={true}
				>
					<FriendsList />
				</SettingsCard>

				<SettingsCard 
					title="Outgoing Friend Requests"
					subtitle="View and cancel all the pending friend requests you've sent"
					isFoldable={true}
					defaultExpanded={false}
				>
					<OutgoingFriendRequestsList />
				</SettingsCard>

				<SettingsCard 
					title="Incoming Friend Requests"
					subtitle="View and decline all the pending friend requests you've received"
					isFoldable={true}
					defaultExpanded={false}
				>
					<IncomingFriendRequestsList />
				</SettingsCard>

				<SettingsCard 
					title="Blocked Users"
					subtitle="View and unblock all the users you have blocked"
					isFoldable={true}
					defaultExpanded={false}
				>
					<BlockedList />
				</SettingsCard>

				{/* <div className="flex flex-col gap-5 px-18 mt-8 mb-4">
					<h1>Language</h1>
					<h1>Notifications</h1>
				</div> */}
			</div>
		</motion.div>
	);
}
