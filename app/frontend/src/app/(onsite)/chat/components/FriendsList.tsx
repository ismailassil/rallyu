"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LoggedUser } from "../types/chat.types";
import { useChat } from "../context/ChatContext";
import moment from "moment";
import Avatar from "../../users/components/Avatar";

const FriendsList = () => {
	const [prefix, setPrefix] = useState("");
	const [filteredSuggestions, setFilteredSuggestions] = useState<LoggedUser[]>([]);
	const { messages, BOSS, setShowConversation, friends, setSelectedUser, selectedUser } =
		useChat();

	const [displayUsers, setDisplayUsers] = useState<LoggedUser[] | null>(null);
	const hasFriends = displayUsers?.length! > 0;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value;
		setPrefix(input);
		const filtred = (friends as LoggedUser[]).filter((user) =>
			(user.first_name + user.last_name).toLowerCase().includes(input.toLowerCase())
		);
		setFilteredSuggestions(filtred);
	};

	const getLastMessage = (userId: number) => {
		const userMessages = messages.filter(
			(msg) =>
				(msg.senderId === userId && msg.receiverId === BOSS?.id) ||
				(msg.senderId === BOSS?.id && msg.receiverId === userId)
		);

		if (!userMessages.length) return null;
		return userMessages.reduce((latest, current) =>
			current.created_at > latest.created_at ? current : latest
		);
	};

	useEffect(() => {
		const baseUsers = prefix ? filteredSuggestions : friends || [];

		const sorted = [...baseUsers].sort((a, b) => {
			const lastA = getLastMessage(a.id);
			const lastB = getLastMessage(b.id);

			if (!lastA) return 1;
			if (!lastB) return -1;

			return lastB.created_at.localeCompare(lastA.created_at);
		});

		setDisplayUsers(sorted);
	}, [prefix, filteredSuggestions, friends, messages]);

	const setDate = (msg: string): string => {
		const date = moment.utc(msg).local();
		const now = moment();

		if (date.isSame(now, "day")) {
			return date.format("HH:mm");
		}
		if (date.isSame(now.clone().subtract(1, "day"), "day")) {
			return "Yesterday";
		}
		return date.format("DD/MM/YYYY");
	};

	return (
		<div className="flex size-full flex-col">
			<div>
				<h2 className="my-5 cursor-pointer text-4xl md:my-9">Chat</h2>
				<div className="relative w-full">
					<div className="mb-6 flex w-full gap-2 rounded-full border-white/30 bg-white/8 p-2 transition-all duration-200 focus-within:bg-white/12 focus-within:ring-2 focus-within:ring-white/18">
						<Image
							width={22}
							height={22}
							src="/icons/user-search.svg"
							alt="search icon"
						/>
						<input
							type="text"
							value={prefix}
							onChange={handleChange}
							placeholder="Start Searching..."
							className="w-full bg-transparent placeholder-gray-400 focus:outline-none"
						/>
					</div>
				</div>
			</div>
			<div className="custom-scrollbar flex-1 overflow-y-auto">
				{hasFriends ? (
					<ul>
						{displayUsers?.map((user) => {
							const lastMessage = getLastMessage(user.id);
							return (
								<li
									key={user?.id}
									onClick={() => {
										setSelectedUser(user);
										setFilteredSuggestions([]);
										setPrefix("");
										setShowConversation(true);
										window.history.pushState(
											null,
											"",
											`/chat/${user?.username}`
										); // ====> read more about this
									}}
								>
									<div
										className={`flex gap-4 p-2 hover:cursor-pointer hover:rounded-lg hover:bg-white/5 ${selectedUser?.id === user?.id ? "rounded-lg bg-white/15" : "bg-white/0"} w-full`}
									>
										<div className="size-[40] flex-shrink-0 overflow-hidden rounded-full border border-white/30 md:size-[50px]">
											<Avatar
												avatar={user?.avatar_url}
												alt={`${user?.first_name + " " + user?.last_name} avatar`}
												className="h-full w-full"
											/>
										</div>
										<div className="flex w-full min-w-0 flex-col justify-between gap-1 p-0.5">
											<div className="flex w-full items-center justify-between">
												<div className="line-clamp-1 min-w-0 flex-1">
													{user?.first_name + " " + user?.last_name}
												</div>
												{lastMessage && (
													<div className="ml-2 min-w-0 flex-shrink-0 truncate text-xs text-gray-400">
														{setDate(lastMessage.created_at)}
													</div>
												)}
											</div>
											<div className="flex w-full items-center justify-between">
												<div className="flex-1 truncate text-xs text-gray-400 md:text-sm">
													{lastMessage?.text || "No messages yet"}
												</div>
												<div className="bg-main ml-2 size-2 flex-shrink-0 rounded-full" />
												{/* {!lastMessage?.isSeen && <div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />} */}
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<div className="flex h-full items-center justify-center">
						<p className="md:text text-sm text-gray-400">No friends found</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default FriendsList;
