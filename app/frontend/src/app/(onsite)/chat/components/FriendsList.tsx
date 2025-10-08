"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LoggedUser } from '../types/chat.types';
import { useChat } from '../context/ChatContext';
import moment from 'moment';
import Avatar from '../../users/components/Avatar';


const FriendsList = () => {

	const [prefix, setPrefix] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<LoggedUser[]>([]);
	const { messages, BOSS, setShowConversation, friends, setSelectedUser, selectedUser, } = useChat();

	const [displayUsers, setDisplayUsers] = useState<LoggedUser[] | null>(null);
	const hasFriends = displayUsers?.length! > 0;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input)
		const filtred = (friends as LoggedUser[]).filter(user => (user.first_name + user.last_name).toLowerCase().includes(input.toLowerCase()))
		setFilteredSuggestions(filtred)
	}


	const getLastMessage = (userId: number) => {
		const userMessages = messages.filter(msg =>
			(msg.senderId === userId && msg.receiverId === BOSS?.id) ||
			(msg.senderId === BOSS?.id && msg.receiverId === userId)
		);

		if (!userMessages.length) return null;
		return userMessages.reduce((latest, current) =>
			current.created_at > latest.created_at ? current : latest
		);
	};

	useEffect(() => {
		const baseUsers = prefix ? filteredSuggestions : (friends || []);

		const sorted = [...baseUsers].sort((a, b) => {
			const lastA = getLastMessage(a.id);
			const lastB = getLastMessage(b.id);

			if (!lastA) return 1;
			if (!lastB) return -1;

			return lastB.created_at.localeCompare(lastA.created_at);
		});

		setDisplayUsers(sorted);
	}, [prefix, filteredSuggestions, friends, messages]);


	const setDate = (msg: string): string => {

		const date = moment.utc(msg).local();
		const now = moment();

		if (date.isSame(now, 'day')) {
			return date.format('HH:mm');
		}
		if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
			return 'Yesterday';
		}
		return date.format('DD/MM/YYYY');
	};


	return (
		<div className=" flex flex-col size-full">
			<div>
				<h2 className="text-4xl my-5 md:my-9 cursor-pointer">Chat</h2>
				<div className="relative w-full">
					<div className="w-full flex gap-2 border-white/30 rounded-full focus-within:bg-white/12
													duration-200 transition-all bg-white/8 p-2 mb-6 focus-within:ring-2 focus-within:ring-white/18">
						<Image width={22} height={22} src="/icons/user-search.svg" alt="search icon" />
						<input
							type="text"
							value={prefix}
							onChange={handleChange}
							placeholder="Start Searching..."
							className="bg-transparent focus:outline-none placeholder-gray-400 w-full"
						/>
					</div>
				</div>
			</div>
			<div className="overflow-y-auto flex-1 custom-scrollbar">
				{hasFriends ? (
					<ul>
						{displayUsers?.map((user) => {
							const lastMessage = getLastMessage(user.id);
							return (
								< li key={user?.id} onClick={() => {
									setSelectedUser(user)
									setFilteredSuggestions([])
									setPrefix("")
									setShowConversation(true)
									window.history.pushState(null, "", `/chat/${user?.username}`) // ====> read more about this
								}}>
									<div className={`flex gap-4 hover:cursor-pointer hover:bg-white/5 hover:rounded-lg p-2 ${selectedUser?.id === user?.id ? 'bg-white/15 rounded-lg' : 'bg-white/0'} w-full`}>
										<div className=' size-[40] md:size-[50px] flex-shrink-0 overflow-hidden rounded-full border border-white/30'>
											<Avatar
												avatar={user?.avatar_url}
												alt={`${user?.first_name + " " + user?.last_name} avatar`}
												className='w-full h-full'
											/>
										</div>
										<div className='flex flex-col w-full gap-1 justify-between p-0.5 min-w-0'>
											<div className='flex w-full justify-between items-center'>
												<div className='line-clamp-1 flex-1 min-w-0'>{user?.first_name + " " + user?.last_name}</div>
												{lastMessage && <div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{setDate(lastMessage.created_at)}</div>}
											</div>
											<div className='flex w-full justify-between items-center'>
												<div className='text-gray-400 text-xs md:text-sm truncate flex-1'>
													{lastMessage?.text || 'No messages yet'}
												</div>
												<div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />
												{/* {!lastMessage?.isSeen && <div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />} */}
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<div className="flex items-center justify-center h-full">
						<p className="text-sm md:text text-gray-400">No friends found</p>
					</div>
				)}
			</div>
		</div >
	);
};

export default FriendsList;