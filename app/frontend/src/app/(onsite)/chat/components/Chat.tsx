"use client"


import Image from "next/image"
import { useState, useContext } from "react"
import Conversation from "./Conversation";
import DM from "./DM";
import users from "./Users.json"
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";

type User = {
	name: string;
	id: number;
	message: string;
	image: string;
	date: string;
	isSeen: boolean;
	lastSeen: string;
};

const Chat = () => {
	const [conversation, setConversation] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [prefix, setPrefix] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);
	const { showConversation, setShowConversation } = useChat();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input)

		const filtred = users.filter(user => user.name.toLowerCase().includes(input.toLowerCase()))
		setFilteredSuggestions(filtred)
	}


	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<div className="bg-card border-br-card flex size-full justify-center
							rounded-2xl border-2 p-4 gap-4 text-red-400 md:text-accent text-sm md:text-base">
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
							<div className="overflow-y-auto flex-1 custom-scrollbar">
								<ul>
									{(filteredSuggestions.length > 0 ? filteredSuggestions : users).map((userData: User, index: number) => (
										<li key={index} onClick={() => {
											setConversation(true)
											setSelectedUser(userData)
											setFilteredSuggestions([])
											setPrefix("")
											setShowConversation(true)
										}}>
											<DM user={userData} selectedUser={selectedUser} />
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					{/* ---------------------------------------thinking image--------------------------------------- */}
					{!conversation && !showConversation && (
						<div className="hidden md:flex md:w-[65%] border-2 h-full border-white/30 rounded-lg ">
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
					)}
					{/* ---------------------------------------conversation area--------------------------------------- */}
					{conversation && selectedUser && (
						<div className={`${showConversation ? `flex` : `hidden md:flex`} size-full md:w-[65%]  `}>
							<Conversation user={selectedUser} receiverId={selectedUser.id} />
						</div>
					)}
				</div>
			</motion.main>
		</AnimatePresence>
	);
};

export default Chat;  
