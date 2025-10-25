"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import { useChat } from "../context/ChatContext";
import { useRouter } from "next/navigation";
import Avatar from "../../users/components/Avatar";
import useRequestBattleFriend from "@/app/hooks/useRequestBattleFriend";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { Swords, UserX } from "lucide-react";
import useIsOnline from "@/app/hooks/useIsOnline";
import { useTranslations } from "next-intl";

const ConversationHeader = () => {
	const [option, setOption] = useState(false);
	const { setShowConversation, setSelectedUser, selectedUser, setDisplayUsers, displayUsers } = useChat();
	const route = useRouter();
	const { apiClient, isBusy } = useAuth();
	const [timer, setTimer] = useState<boolean>(false);
	const requestBattleFriend = useRequestBattleFriend();
	const t = useTranslations("chat.status");

	function onPlay(event: any, gameType: "pingpong" | "tictactoe") {
		if (isBusy) return;

		setOption(false);
		setTimer(true);
		requestBattleFriend(event, selectedUser?.id, gameType);
	}

	const onBlock = async () => {
		if (!selectedUser?.id) return;
		
		const blockedUser = selectedUser;
		const previousUsers = displayUsers;
		
		try {
			setDisplayUsers(users => 
				users.filter(user => user.id !== blockedUser.id)
			);
			setSelectedUser(null);
			setShowConversation(false);
			await apiClient.blockUser(blockedUser.id);
			
		} catch (error) {
			console.error('Failed to block user:', error);

			setDisplayUsers(previousUsers);
			setSelectedUser(blockedUser);
			setShowConversation(true);
		}
	}

	// online status
	const isOnline = useIsOnline(selectedUser?.id as number);

	return (
		<div className="flex justify-start gap-4 border-b border-b-white/30 p-4 pl-6">
			<div className="flex cursor-pointer items-center md:hidden">
				<ArrowCircleLeftIcon
					size={28}
					onClick={() => {
						setShowConversation(false);
						route.replace("/chat");
						setSelectedUser(null);
					}}
				/>
			</div>
			<div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/30">
				<Avatar
					avatar={selectedUser?.avatar_url}
					alt={`${selectedUser?.first_name + " " + selectedUser?.last_name} avatar`}
					className="h-full w-full"
				/>
			</div>
			<div className="flex flex-col justify-center">
				<span
					className="hover:cursor-pointer"
					onClick={() => route.push(`/users/${selectedUser?.username}`)}
				>
					{selectedUser?.first_name + " " + selectedUser?.last_name}
				</span>
				<div className="flex items-center gap-2">
					<span
						className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-400"}`}
					/>
					<span className="font-funnel-display text-gray-400">
						{isOnline ? t("online") : t("offline")}
					</span>
				</div>
			</div>
			<div className="relative my-auto ml-auto flex h-8 gap-4">
				<button
					className={`${isBusy ? "cursor-not-allowed" : "cursor-pointer hover:w-20"} flex h-10 w-10 scale-100 items-center overflow-hidden rounded-full border border-white/5 bg-white/4 p-[9px] transition-all duration-500 ease-in-out hover:bg-white/8 active:scale-105`}
					onMouseEnter={() => !isBusy && setOption(true)}
					onMouseLeave={() => setOption(false)}
					disabled={isBusy}
				>
					<Swords className={`${option ? `hidden` : ``}`} />
					{option && (
						<div className="flex w-full items-center justify-around gap-1 *:duration-500 *:hover:scale-120">
							<Image
								width={16}
								height={16}
								alt="XO icon"
								className="brightness-0 invert filter"
								src={`/design/tictactoe.svg`}
								onClick={(e) => onPlay(e, "tictactoe")}
							/>
							<Image
								width={18}
								height={18}
								alt="ping pong icon"
								src={`/icons/ping-pong.svg`}
								onClick={(e) => onPlay(e, "pingpong")}
							/>
						</div>
					)}
					{timer && (
						<motion.div
							className="bg-accent absolute top-0 left-0 -z-1 size-full"
							animate={{ width: 0 }}
							transition={{ duration: 10 }}
							onAnimationComplete={() => {
								setTimer(false);
							}}
						/>
					)}
				</button>

				<Link
					href={`/chat`}
					className="group/button flex h-10 w-10 scale-100 cursor-pointer items-center overflow-hidden rounded-full border border-white/5 bg-white/4 p-[9px] transition-all duration-500 ease-in-out hover:bg-white/8 active:scale-105"
					onClick={onBlock}
				>
					<UserX />
				</Link>
			</div>
		</div>
	);
};

export default ConversationHeader;
