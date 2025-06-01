"use client"
import UserMessage from "./components/MessagesList"
import Image from "next/image"
import { useState } from "react"
import ConversationBody from "./components/ConversationBody"

const ChatBody = () => {
	const [conversation, setConversation] = useState(false)
	return (

		<div className="flex w-full  border-2 border-white/30 rounded-lg p-4 gap-4">
			{/* user's list  */}
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
						{Array.from({ length: 10 }).map((_, i) => (
							<li key={i} onClick={() => setConversation(true)}>
							<UserMessage />
							</li>
						))}
					</ul>
			</div>
			{/* thinking image */}
				{!conversation && <div  className="w-11/12 border-2 h-full border-white/30 rounded-lg">

					<div className="flex h-full flex-col items-center justify-center">
						<Image width={300} height={300} src={"/meme/thinking.gif"} alt="thiniking image" className="rounded-lg "/>
						<p className="text-lg mt-4">👋 Welcome to Chat!</p>
						<p className="text-gray-400">Select a user from the sidebar to start chatting.</p>
					</div>
				</div>
			}
			{/* converstation area */}
			{conversation && <ConversationBody />}
			</div>
		);
};

export default ChatBody;