"use client";
import Image from 'next/image';
import { useState } from 'react';
import { LoggedUser } from '../types/chat.types';
import { useChat } from '../context/ChatContext';
import Avatar from '../../users/components/Avatar';
import { useTranslations } from 'next-intl';
import LoadingComponent from '@/app/(auth)/components/UI/LoadingComponents';

const FriendsList = () => {
	const [prefix, setPrefix] = useState("");
	const [filteredSuggestions, setFilteredSuggestions] = useState<LoggedUser[]>([]);
	const {isLoadingFriends, displayUsers, setShowConversation, setSelectedUser, selectedUser, formatMessageDateTime } = useChat();
	const hasFriends = prefix ? filteredSuggestions.length > 0 : displayUsers.length > 0;
	const t = useTranslations("chat");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input);
		if (displayUsers) {
			const filtred = (displayUsers as LoggedUser[]).filter(user => (user.first_name + user.last_name).toLowerCase().includes(input.toLowerCase()));
			setFilteredSuggestions(filtred);
		}
	};

	const handleSelectUser = (user: LoggedUser) => {
		if (!user?.id) return;

		setSelectedUser((prev) => {
			const newSelected = prev?.id === user.id ? null : user;
			setShowConversation(!!newSelected);
			return newSelected;
		});
		setFilteredSuggestions([]);
		setPrefix("");
		window.history.pushState(null, "", `/chat/${user.username}`);
	};

	return (
		<div className="flex size-full flex-col">
			<div>
				<h2 className="my-5 cursor-pointer text-4xl md:my-9">{t("title")}</h2>
				<div className="relative w-full">
					<div className="mb-6 flex w-full gap-2 rounded-full border-white/30 bg-white/8 p-2 transition-all duration-200 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-white/18">
						<Image
							width={22}
							height={22}
							src="/icons/user-search.svg"
							alt="search icon"
						/>
						<input
							type="text"
							value={prefix}
							onChange={handleChange}
							placeholder={t("search")}
							className="w-full bg-transparent placeholder-gray-400 focus:outline-none"
						/>
					</div>
				</div>
			</div>
			<div className="custom-scrollbar flex-1 overflow-y-auto">
				{!isLoadingFriends ? (
					hasFriends ? (
						<ul>
							{(prefix ? filteredSuggestions : displayUsers)?.map((user) => {
								const { date } = formatMessageDateTime(user?.last_message?.created_at, "list");

								return (
									< li key={user?.id} onClick={() => handleSelectUser(user)}>
										<div className={`flex gap-4 hover:cursor-pointer hover:bg-white/5 hover:rounded-lg p-2 ${selectedUser?.id === user?.id ? 'bg-white/15 rounded-lg' : 'bg-white/0'} w-full`}>
											<div className=' size-[40] md:size-[50px] flex-shrink-0 overflow-hidden rounded-full border border-white/30'>
												<Avatar
													avatar={user?.avatar_url}
													alt={`${user?.first_name + " " + user?.last_name} avatar`}
													className="h-full w-full"
												/>
											</div>
											<div className='flex flex-col w-full gap-1 justify-between p-0.5 min-w-0'>
												<div className='flex w-full justify-between items-center'>
													<div className='line-clamp-1 flex-1 min-w-0'>{user?.first_name + " " + user?.last_name}</div>
													{user.last_message && <div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{date}</div>}
												</div>
												<div className='flex w-full justify-between items-center'>
													<div className='text-gray-400 text-xs md:text-sm truncate flex-1'>
														{user.last_message?.text || 'No messages yet'}
													</div>
													{/* {<div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />} */}
												</div>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					) : (
						<div className="flex h-full items-center justify-center">
							<p className="md:text text-sm text-gray-400">{t("no_friends")}</p>
						</div>
					)
				) : (<LoadingComponent />)}

			</div>
		</div>
	);
};

export default FriendsList;
