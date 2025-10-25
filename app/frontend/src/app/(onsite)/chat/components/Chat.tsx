"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Conversation from "./Conversation";
import FriendsList from "./FriendsList";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { useTranslations } from "next-intl";
import { LoggedUser } from "../types/chat.types";

const Chat = ({ username }: { username?: string }) => {

	const { setIsLoadingFriends, apiClient, BOSS, showConversation, setShowConversation, setSelectedUser, selectedUser } = useChat();
	const route = useRouter();
	const [friends, setFriends] = useState<LoggedUser[] | null>(null);
	const t = useTranslations("chat");
// ADD LOQDING FRIEND COMPONENT
	useEffect(() => {
		async function getAllFriends() {
			try {
				const allFriends = await apiClient.getAllFriends();
				setFriends(allFriends);
			} catch (err: any) {
				console.log(err);
			} finally {
				setIsLoadingFriends(false);
			}
		}
		getAllFriends();
	}, [BOSS?.id, apiClient]);

	useEffect(() => {
		if (!username || username.length === 0 || !friends || friends.length === 0) return;
		const match = friends.find((element) => element.username === username);
		if (match) {
			setSelectedUser(match);
			setShowConversation(true);
		} else {
			route.replace('/chat/');
		}
	}, [username, route, friends?.length]);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="pt-30 sm:pl-30 h-dvh w-full pb-24 pl-6 pr-6 sm:pb-6"
			>
				<div className="bg-card border-br-card flex size-full justify-center w-full
							rounded-2xl border-2 p-4 gap-4 text-sm md:text-base">
							<>
								<div className={`${showConversation ? 'hidden md:flex' : 'flex'} flex-col size-full md:max-w-[35%] md:min-w-[35%] md:w-[35%]`}>
									<FriendsList />
								</div>
								<div className={!showConversation ? `hidden md:flex md:w-[63%] border h-full border-white/30 rounded-lg bg-white/4` : ` hidden`}>
									<div className="flex size-full flex-col items-center justify-center">
										<Image
											width={300}
											height={300}
											src="/meme/thinking.gif"
											alt="thinking image"
											className="rounded-lg"
											unoptimized
										/>
										<span className="text-lg mt-4 text-center">{t("no_conv.title")}</span>
										<span className="text-gray-400 text-center">{t("no_conv.sub")}</span>
									</div>
								</div>
								{selectedUser && (
									<div className={`${showConversation ? `flex` : `hidden md:flex`} size-full md:max-w-[63%] md:min-w-[63%] md:w-[63%]`}>
										<Conversation />
									</div>
								)}
							</>
				</div>
			</motion.main>
		</AnimatePresence>
	);
};

export default Chat;  