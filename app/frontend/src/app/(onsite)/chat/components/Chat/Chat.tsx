"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Conversation from "./Conversation";
import DM from "./DM";
import users from "../Users.json"
import { AnimatePresence, motion } from "framer-motion";

type User = {
	name: string;
	id: number;
	message: string;
	image: string;
	date: string;
	isSeen: boolean;
	lastSeen: string;
};

type MessageType = {
	text: string;
	date: string;
	senderId: number

}

const Chat = () => {
	const [conversation, setConversation] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [prefix, setPrefix] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);

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
				<div className="bg-card border-br-card flex h-full w-full justify-center
							rounded-2xl border-2 p-4 gap-4">
					{/* ---------------------------------------user's list--------------------------------------- */}
					<div className="flex flex-col w-5/12 h-full">

						<h2 className="text-4xl my-9">Chat</h2>
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
						<ul className="overflow-auto custom-scrollbar">
							{(filteredSuggestions.length > 0 ? filteredSuggestions : users).map((userData: User, index: number) => (
								<li key={index} onClick={() => {
									setConversation(true)
									setSelectedUser(userData)
									setFilteredSuggestions([])
									setPrefix("")
								}}>
									<DM user={userData} selectedUser={selectedUser} />
								</li>
							))}
						</ul>
					</div>
					{/* ---------------------------------------thinking image--------------------------------------- */}
					{!conversation && (
						<div className="w-11/12 border-2 h-full border-white/30 rounded-lg">
							<div className="flex h-full flex-col items-center justify-center">
								<Image
									width={300}
									height={300}
									src="/meme/thinking.gif"
									alt="thinking image"
									className="rounded-lg"
								/>
								<p className="text-lg mt-4">👋 Welcome to Chat!</p>
								<p className="text-gray-400">Select a user from the sidebar to start chatting.</p>
							</div>
						</div>
					)}
					{/* ---------------------------------------conversation area--------------------------------------- */}
					{conversation && selectedUser && <Conversation user={selectedUser} receiverId={selectedUser.id} />}
				</div>
			</motion.main>
		</AnimatePresence>
	);
};

export default Chat;  