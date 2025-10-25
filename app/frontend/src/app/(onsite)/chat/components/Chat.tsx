"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import Conversation from "./Conversation";
import FriendsList from "./FriendsList";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "../context/ChatContext";
import { useTranslations } from "next-intl";

const Chat = ({ username }: { username?: string }) => {

	const { showConversation, setShowConversation, displayUsers, setSelectedUser, selectedUser } = useChat();
	const route = useRouter();
	const t = useTranslations("chat");

	useEffect(() => {
		if (!username || username.length === 0 || !displayUsers || displayUsers.length === 0) return;
		const match = displayUsers.find((element) => element.username === username);
		if (match) {
			setSelectedUser(match);
			setShowConversation(true);
		} else
			route.replace('/chat/');
	}, [username, route, displayUsers?.length]);

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
								{/* ---------------------------------------user's list--------------------------------------- */}
								<div className={`${showConversation ? 'hidden md:flex' : 'flex'} flex-col size-full md:max-w-[35%] md:min-w-[35%] md:w-[35%]`}>
									<FriendsList />
								</div>

								{/* ---------------------------------------thinking image--------------------------------------- */}

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

								{/* ---------------------------------------conversation area--------------------------------------- */}

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