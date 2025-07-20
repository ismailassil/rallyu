"use client"

import Image from "next/image"
import { useState } from "react"
import Conversation from "./Conversation";
import DM from "./DM";
import users from "../../Users.json"

type User = {
	name: string;
	message: string;
	image: string;
	date: string;
	isSeen: boolean;
	lastSeen: string;
};

const Chat = () => {
	const [conversation, setConversation] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	return (
		<div className="flex w-full border-2 border-white/30 rounded-lg p-4 gap-4">
			{/* ---------------------------------------user's list--------------------------------------- */}
			<div className="flex flex-col w-5/12 h-full">
				<h2 className="text-4xl mb-8">Chat</h2>
				<div className="w-full flex gap-2 border-white/30 rounded-full bg-white/15 p-2 mb-6">
					<Image width={24} height={24} src="/icons/user-search.svg" alt="search icon" />
					<input
						type="text"
						placeholder="Start Searching..."
						className="bg-transparent focus:outline-none placeholder-gray-300 w-full"
					/>
				</div>
				<ul className="overflow-auto custom-scrollbar">
					{users.map((userData: User, index: number) => (
						<li key={index} onClick={() => {
							setConversation(true)
							setSelectedUser(userData)
						}}>
							<DM user={userData} />
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
			{conversation && selectedUser && <Conversation users={selectedUser} />}
		</div>
	);
};

export default Chat;  