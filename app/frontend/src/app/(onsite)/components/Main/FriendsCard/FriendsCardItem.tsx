'use client';
import { Send, Swords } from "lucide-react";
import Avatar from "../../../users/components/Avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface LeaderboardProps {
	username: string;
	avatar: string;
	isOnline: boolean;
}

export default function FriendsCardItem({
	username,
	avatar,
	isOnline
} : LeaderboardProps) {
	const t = useTranslations('common');

	return (
		<div className="flex bg-white/2 border border-white/8 rounded-2xl py-4 px-5 justify-between items-center select-none">
			<Link href={`/users/${username}`} className="flex gap-5 items-center">
				{/* AVATAR */}
				<div className="flex ring-accen ring-2 aspect-square h-[40px] w-[40px] items-center justify-center rounded-full lg:h-[40px] lg:w-[40px]">
					<Avatar avatar={avatar} className='h-full w-full' />
				</div>

				{/* CONTENT */}
				<div className="">
					<h2 className="text-wrap text-base lg:text-lg">
						{username}
					</h2>
					<p className={`text-sm ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
						{isOnline ? `${t('online')}` : `${t('offline')}`}
					</p>
				</div>
			</Link>

			{/* CHAT BUTTON */}
			<div className="flex gap-3">
				<Link href={`/chat/${username}`} className="group/button w-10 h-10 hover:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105">
					<Swords className="w-5 h-5 flex-shrink-0 transition-transform duration-600 group-hover/button:rotate-180 ease-in-out" />
					<span className="ml-3 whitespace-nowrap font-medium opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 ease-in-out">
						{t('play')}
					</span>
				</Link>

				<Link href={`/chat/${username}`} className="group/button w-10 h-10 hover:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[8px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105">
					<Send className="w-5 h-5 flex-shrink-0 transition-transform duration-500 group-hover/button:rotate-45 ease-in-out" />
					<span className="ml-3 whitespace-nowrap font-medium opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 ease-in-out">
						{t('chat')}
					</span>
				</Link>
			</div>
		</div>
	);
}
