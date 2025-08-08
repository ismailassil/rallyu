"use client"

import Image from "next/image"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react"
import Conversation from "./Conversation";
import FriendsList from "./FriendsList";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { LoggedUser } from '../types/Types';
import chalk from 'chalk';



const Chat = ({ username }: { username?: string }) => {
	const [conversation, setConversation] = useState(false)
	const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null)
	const [prefix, setPrefix] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<LoggedUser[]>([]);
	const { BOSS, api, socket, showConversation, setShowConversation, isLoadingFriends, friends, messages, setMessages } = useChat();
	const route = useRouter();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input)
		const filtred = (friends as LoggedUser[]).filter(user => (user.first_name + user.last_name).toLowerCase().includes(input.toLowerCase()))
		setFilteredSuggestions(filtred)
	}

	useEffect(() => {
		if (!username || username.length === 0 || !friends) return;

		const match = friends.find((element) => element.username === username);
		if (match) {
			setSelectedUser(match);
			setConversation(true);
			setShowConversation(true);
		} else
			route.replace('/chat/');

}, [friends, username, route, setShowConversation]);

	useEffect(() => {
		if (!BOSS?.id) return;

		api.instance.get('/chat/history')
			.then((response: any) => {
				// console.log(`+++++>${JSON.stringify(response.data)}++++++\n`)
				setMessages(response?.data)
			})
			.catch((error: any) => {
				console.error("Error fetching chat history:", error);
			});
	}, [BOSS?.id, selectedUser?.id, api.instance, setMessages]);





	
	
	

	
	
		if (isLoadingFriends)
			return (<h1 className=" absolute top-20">Still Loading</h1>);
	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<div className="bg-card border-br-card flex size-full justify-center
							rounded-2xl border-2 p-4 gap-4 text-sm md:text-base">

					{/* ---------------------------------------user's list--------------------------------------- */}

					<div className={`${showConversation ? 'hidden md:flex' : 'flex'} flex-col size-full md:w-[35%]`}>
						<div className=" flex flex-col size-full">
							<div className="">
								<h2 className="text-4xl my-5 md:my-9">Chat</h2>
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
							{friends?.length! > 0 ?
								<div className="overflow-y-auto flex-1 custom-scrollbar">
									<ul>
										{(filteredSuggestions.length > 0 ? filteredSuggestions : friends)?.map((user: LoggedUser | null, index: number) => (
											<li key={index} onClick={() => {
												setConversation(true)
												setSelectedUser(user)
												setFilteredSuggestions([])
												setPrefix("")
												setShowConversation(true)
												window.history.pushState(null, "", `/chat/${user?.username}`) // ====> read more about this
											}}>
												<FriendsList user={user} selectedUser={selectedUser} />
											</li>
										))}
									</ul>
								</div>
								:
								<p className="m-auto text-sm">No friends found</p>
							}
						</div>
					</div>

					{/* ---------------------------------------thinking image--------------------------------------- */}

					<div className={!conversation && !showConversation ? `hidden md:flex md:w-[65%] border-2 h-full border-white/30 rounded-lg bg-white/4` : ` hidden`}>
						<div className="flex size-full flex-col items-center justify-center">
							<Image
								width={300}
								height={300}
								src="/meme/thinking.gif"
								alt="thinking image"
								className="rounded-lg"
								unoptimized
							/>
							<span className="text-lg mt-4 text-center">👋 Welcome to Chat!</span>
							<span className="text-gray-400 text-center">Select a user from the sidebar to start chatting.</span>
						</div>
					</div>

					{/* ---------------------------------------conversation area--------------------------------------- */}

					{selectedUser && (
						<div className={`${conversation && showConversation ? `flex` : `hidden md:flex`} size-full md:w-[65%]  `}>
							<Conversation selectedUser={selectedUser} />
						</div>
					)}
				</div>
			</motion.main>
		</AnimatePresence>
	);
};

export default Chat;  