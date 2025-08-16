"use client"

import Image from "next/image"
import { useRouter } from 'next/navigation';
import { useEffect } from "react"
import Conversation from "./Conversation";
import FriendsList from "./FriendsList";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../../contexts/AuthContext";


const Chat = ({ username }: { username?: string }) => {

	const { BOSS, api, showConversation, setShowConversation, isLoadingFriends, friends,
		setMessages, setSelectedUser, selectedUser } = useChat();

	const { socket } = useAuth();
	const route = useRouter();


	useEffect(() => {
		if (!username || username.length === 0 || !friends) return;

		const match = friends.find((element) => element.username === username);
		if (match) {
			setSelectedUser(match);
			setShowConversation(true);
		} else
			route.replace('/chat/');

	}, [friends, username, route, setShowConversation]);

	useEffect(() => {
		if (!BOSS?.id) return;

		// ** This is used to mark all the notification from chat to dismissed
		const payload = {
			type: "chat",
			state: "finished",
			status: "dismissed",
		};

		socket.emit('notification_update_on_type', payload);

		apiClient.instance.get('/chat/history')
			.then((response: any) => {
				console.log(response.data)
				setMessages(response?.data)
			})
			.catch((error: any) => {
				console.error("Error fetching chat history:", error);
			});
	}, []);

	if (isLoadingFriends)
		return (<h1 className=" absolute top-20">Still Loading</h1>);
	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-dvh w-full pb-24 pl-6 pr-6 sm:pb-6"
			>
				<div className="bg-card border-br-card flex size-full justify-center w-full
							rounded-2xl border-2 p-4 gap-4 text-sm md:text-base">

					{/* ---------------------------------------user's list--------------------------------------- */}

					<div className={`${showConversation ? 'hidden md:flex' : 'flex'} flex-col size-full md:max-w-[35%] md:min-w-[35%] md:w-[35%]`}>
						<FriendsList />
					</div>

					{/* ---------------------------------------thinking image--------------------------------------- */}

					<div className={!showConversation ? `hidden md:flex md:w-[63%] border-2 h-full border-white/30 rounded-lg bg-white/4` : ` hidden`}>
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
						<div className={`${showConversation ? `flex` : `hidden md:flex`} size-full md:max-w-[63%] md:min-w-[63%] md:w-[63%]`}>
							<Conversation />
						</div>
					)}
				</div>
			</motion.main>
		</AnimatePresence>
	);
};

export default Chat;  