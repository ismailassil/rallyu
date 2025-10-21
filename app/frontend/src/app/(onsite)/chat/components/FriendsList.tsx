"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LoggedUser } from '../types/chat.types';
import { useChat } from '../context/ChatContext';
import Avatar from '../../users/components/Avatar';
import { format, isToday, isYesterday, parseISO } from 'date-fns';


const FriendsList = () => {

	const [prefix, setPrefix] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<LoggedUser[]>([]);
	const { apiClient, messages, BOSS, setShowConversation, showConversation, setSelectedUser, selectedUser, } = useChat();
	const [displayUsers, setDisplayUsers] = useState<LoggedUser[]>([]);
	const hasFriends = prefix ? filteredSuggestions.length > 0 : displayUsers.length > 0;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input)
		if (displayUsers) {
			const filtred = (displayUsers as LoggedUser[]).filter(user => (user.first_name + user.last_name).toLowerCase().includes(input.toLowerCase()))
			setFilteredSuggestions(filtred)
		}
	}

	const handleSelectUser = (user: LoggedUser) => {
		if (!user?.id) return;
	
		setSelectedUser(user);
		setFilteredSuggestions([]);
		setPrefix("");
		setShowConversation(true);
		window.history.pushState(null, "", `/chat/${user.username}`);
	};
	


	useEffect(() => {
		if (!BOSS?.id) return;
		apiClient.instance.get('/chat/friend_list')
			.then((response: any) => {
				setDisplayUsers(response.data)
			})
			.catch((error: any) => {
				console.error("Error fetching chat history:", error);
			});
	}, [BOSS?.id, apiClient, showConversation, messages]); // check this 



	const setDate = (dateString: string): string => {
		const date = parseISO(dateString);

		if (isToday(date)) {
			return format(date, 'HH:mm');
		}
		if (isYesterday(date)) {
			return 'Yesterday';
		}
		return format(date, 'dd/MM/yyyy');
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
						{(prefix ? filteredSuggestions : displayUsers)?.map((user) => {
							return (
								< li key={user?.id} onClick={() => handleSelectUser(user)}>
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
												{user.last_message && <div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{setDate(user.last_message.created_at)}</div>}
											</div>
											<div className='flex w-full justify-between items-center'>
												<div className='text-gray-400 text-xs md:text-sm truncate flex-1'>
													{user.last_message?.text || 'No messages yet'}
												</div>
												{/* {user.last_message.isSeen && <div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />} */}
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