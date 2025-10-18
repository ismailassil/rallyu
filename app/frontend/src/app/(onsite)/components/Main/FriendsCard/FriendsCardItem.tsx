/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Send, Swords } from "lucide-react";
import Avatar from "../../../users/components/Avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useIsOnline from "@/app/hooks/useIsOnline";
import Image from "next/image";
import useRequestBattleFriend from "@/app/hooks/useRequestBattleFriend";
import { useState } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { motion } from "framer-motion";

interface FriendsCardItemProps {
	id: number;
	username: string;
	avatar: string;
}

export default function FriendsCardItem({ id, username, avatar }: FriendsCardItemProps) {
	const isOnline = useIsOnline(id);
	const t = useTranslations("common");
	const [option, setOption] = useState(false);
	const [timer, setTimer] = useState<boolean>(false);
	const { socket } = useAuth();
	const requestBattleFriend = useRequestBattleFriend();
	function onPlay(event: any, gameType: "pingpong" | "tictactoe") {
		setTimer(true);
		requestBattleFriend(event);
		socket.createGame(id, gameType);
	}

	return (
		<div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/2 px-5 py-3 select-none">
			<Link href={`/users/${username}`} className="flex items-center gap-5">
				{/* AVATAR */}
				<div className="ring-accent/20 flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-full ring-2 lg:h-[40px] lg:w-[40px]">
					<Avatar avatar={avatar} className="h-full w-full" />
				</div>

				{/* CONTENT */}
				<div className="">
					<h2 className="text-base text-wrap lg:text-lg">{username}</h2>
					<p className={`text-sm ${isOnline ? "text-green-400" : "text-gray-400"}`}>
						{isOnline ? `${t("online")}` : `${t("offline")}`}
					</p>
				</div>
			</Link>

			{/* CHAT BUTTON */}
			<div className="flex gap-3">
				<div
					className={`flex h-10 w-10 scale-100 cursor-pointer items-center overflow-hidden rounded-full border border-white/5 bg-white/4 p-[9px] transition-all duration-500 ease-in-out hover:w-20 hover:bg-white/8 active:scale-105`}
					onMouseEnter={() => setOption(true)}
					onMouseLeave={() => setOption(false)}
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
							className="bg-accent absolute bottom-0 left-0 -z-1 h-1 w-full"
							animate={{ width: 0 }}
							transition={{ duration: 10.5 }}
							onAnimationComplete={() => {
								setTimer(false);
							}}
						/>
					)}
				</div>

				<Link
					href={`/chat/${username}`}
					className="group/button flex h-10 w-10 scale-100 cursor-pointer items-center overflow-hidden rounded-full border border-white/5 bg-white/4 p-[8px] transition-all duration-500 ease-in-out hover:w-23 hover:bg-white/8 active:scale-105"
				>
					<Send className="h-5 w-5 flex-shrink-0 transition-transform duration-500 ease-in-out group-hover/button:rotate-45" />
					<span className="ml-3 font-medium whitespace-nowrap opacity-0 transition-opacity duration-500 ease-in-out group-hover/button:opacity-100">
						{t("chat")}
					</span>
				</Link>
			</div>
		</div>
	);
}
