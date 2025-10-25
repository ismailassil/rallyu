"use client";
import React, { useState, useEffect, useRef, } from 'react';
import Image from "next/image";
import { useChat } from '../context/ChatContext';
import { AlertCircle } from 'lucide-react';
import ConversationHeader from './ConversationHeader';
import { useTranslations } from 'next-intl';
import { LoggedUser, MessageType } from '../types/chat.types';

const ConversationBody = () => {
	const [message, setMessage] = useState("");
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [hasMore, setHasMore] = useState(true)
	const messageRef = useRef<HTMLDivElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const t = useTranslations("chat");
	const { displayUsers, setDisplayUsers, socket, BOSS, messages, selectedUser, formatMessageDateTime, setMessages, apiClient } = useChat();

	const loadMessages = async (pageNum: number) => {
		if (!BOSS?.id || !selectedUser?.id || loading) return;

		setLoading(true);
		const prevmessages = messages;
		const prevPageNum = pageNum;
		try {
			if (!scrollRef.current) return;

			const prevScrollTop = scrollRef.current.scrollTop;
			const prevScrollHeight = scrollRef.current.scrollHeight;
			const response = await apiClient.instance.get(
				`/chat/history?senderId=${BOSS.id}&receiverId=${selectedUser.id}&limit=30&offset=${pageNum * 30}`);
			setMessages(prev => [...response.data, ...prev]);
			requestAnimationFrame(() => {
				if (!scrollRef.current) return;
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight + prevScrollTop;
			});

			if (response.data.length === 0 || response.data.length < 30) setHasMore(false);

		} catch (error) {
			console.error("Error fetching messages:", error);
			setMessages(prevmessages)
			setPage(Math.max(0, prevPageNum - 1))
		} finally {
			setLoading(false);
		}
	};

	const handleScroll = () => {
		if (scrollRef.current) {
			setShowLoadMore(scrollRef?.current.scrollTop < 10);
		}
	};

	useEffect(() => {
		setMessage("");
		setPage(0);
		setMessages([]);
		setShowLoadMore(false);
		setHasMore(true);
		loadMessages(0);

		setTimeout(() => { messageRef.current?.scrollIntoView({ behavior: 'auto' }); }, 100);
	}, [selectedUser?.id]);

	const handleLoadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		loadMessages(nextPage);
	};

	const sendData = () => {
		const text = message.trim();
		if (text && BOSS && selectedUser?.id) {
			const sentMessage: MessageType = {
				senderId: BOSS.id,
				receiverId: selectedUser.id,
				text: text,
				created_at: new Date().toISOString()
			};

			
			setMessage("");
			const friendId = sentMessage.senderId === BOSS?.id ? sentMessage.receiverId : sentMessage.senderId;
			const previousDisplayUsers = displayUsers;
			const prevmessages = messages;

			setDisplayUsers(prevUsers => {
				const updatedFriend = prevUsers.find(user => user.id === friendId);
				if (!updatedFriend)
					return prevUsers;
				return [{ ...updatedFriend, last_message: sentMessage },...prevUsers.filter(user => user.id !== friendId)];
			});

			socket.emit('chat_send_msg', {
				senderId: BOSS.id,
				receiverId: selectedUser.id,
				text: text,
			}, (response: any) => {
				if (response?.error) {
					console.error('Message send failed:', response.error);
					setDisplayUsers(previousDisplayUsers);
					setMessage(text);
					setMessages(prevmessages);
				}
			});

			setTimeout(() => {
				messageRef.current?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	};

	return (
		<div className={` size-full border border-white/30 rounded-lg flex flex-col md:bg-white/4 `}>
			<ConversationHeader />
			<div ref={scrollRef} onScroll={handleScroll} className='overflow-y-auto custom-scrollbar p-4 flex-1 overflow-x-hidden flex flex-col justify-end mb-2 relative'>
				{hasMore && showLoadMore && (
					<div className='sticky top-0 z-10 flex items-center justify-center py-2'>
						<button
							onClick={handleLoadMore}
							disabled={loading}
							className='w-fit text-xs text-white/50 px-3 py-1.5 rounded-md border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 
							disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
							{loading ? 'Loading...' : 'Load More'}
						</button>
					</div>
				)}
				<div className='flex flex-col gap-4 min-h-0'>
					{messages.map((msg, index) => {
						const { date, time } = formatMessageDateTime(msg.created_at, "conversation", messages[index - 1]?.created_at);

						return (
							<React.Fragment key={index}>
								{date && <span className='text-xs text-white/50 m-auto'>{date}</span>}
								<div className={`flex ${msg.senderId === BOSS?.id ? 'justify-end' : 'justify-start'}`}>
									<div className={`max-w-[75%] border-white/30 border px-3 py-1.5 min-w-0 flex flex-col rounded-lg  break-words 
										${msg.senderId === BOSS?.id ? 'bg-blue-600/20 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}>
										<span>{msg.text}</span>
										<span className='text-xs text-white/50 self-end'>{time}</span>
									</div>
								</div>
							</React.Fragment>
						);
					}
					)}
					<div ref={messageRef} />
				</div>
			</div>

			{/* ----------------------------------------------------typing message and send ---------------------------------------------------- */}

			<div className=' flex flex-col border-t border-t-white/30 p-4 '>
				<div className='flex focus-within:bg-white/12 duration-200 transition-all bg-white/8 p-3 rounded-lg justify-between gap-3 focus-within:ring-2
					 focus-within:ring-white/18'>
					<input
						id='input-text'
						type='text'
						placeholder={t("input_placeholder")}
						value={message}
						maxLength={300}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), sendData())}
						className='focus:outline-none bg-transparent flex justify-around placeholder:text-white/50 w-full' />
					{message.length >= 300 &&
						<div className=' text-red-500 text-xs flex items-center whitespace-nowrap gap-1'>
							<AlertCircle size={12} />
							<p>{t("maximum")} 300</p>
						</div>}
					<Image
						width={20}
						height={20}
						src={"/icons/send.svg"}
						alt='send icon'
						className='hover:cursor-pointer' onClick={sendData}
					/>

				</div>
			</div>
		</div>
	);
};

export default ConversationBody;

