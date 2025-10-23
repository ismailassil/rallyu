"use client";
import React, { useState, useEffect, useRef, } from 'react';
import Image from "next/image";
import { useChat } from '../context/ChatContext';
import { MessageType } from '../types/chat.types';
import { AlertCircle } from 'lucide-react';
import ConversationHeader from './ConversationHeader';
import { useTranslations } from 'next-intl';




const ConversationBody = () => {
	const [message, setMessage] = useState("");
	const { socket, BOSS, messages, selectedUser, formatMessageDateTime, setMessages, apiClient } = useChat();
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const messageRef = useRef<HTMLDivElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const t = useTranslations("chat");



	useEffect(() => {
		setMessage("");
		setPage(0);
		loadMessages(0);
		messageRef.current?.scrollIntoView({ behavior: 'auto' });
	}, [selectedUser?.id]);

	// Load messages
	const loadMessages = async (pageNum: number) => {
		if (!BOSS?.id || !selectedUser?.id || loading) return;

		setLoading(true);
		try {
			const offset = pageNum * 10;
			const response = await apiClient.instance.get(
				`/chat/history?senderId=${BOSS.id}&receiverId=${selectedUser.id}&limit=10&offset=${offset}`
			);

			setMessages((prev: MessageType[]) => [...response?.data, ...prev]);
		} catch (error) {
			console.error("Error fetching messages:", error);
		} finally {
			setLoading(false);
			console.log("=======\n", messages);
		}
	};

	const handleScroll = () => {
		if (scrollRef.current?.scrollTop === 0 && !loading) {
			const nextPage = page + 1;
			setPage(nextPage);
			loadMessages(nextPage);
		}
	};

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			sendData();
		}
	};

	const sendData = () => {
		const data = message.trim();
		if (data !== "" && BOSS) {
			socket.emit('chat_send_msg', {
				senderId: BOSS.id,
				receiverId: selectedUser?.id,
				text: data,
			});
			setMessage("");
			messageRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<div className="size-full border border-white/30 rounded-lg flex flex-col md:bg-white/4">
			<ConversationHeader />

			<div ref={scrollRef} onScroll={handleScroll} className='overflow-y-auto custom-scrollbar p-4 flex-1 overflow-x-hidden flex flex-col justify-end mb-2'>
				
				<div className='flex flex-col gap-4 min-h-0'>
					{messages.map((msg, index) => {
						const { date, time } = formatMessageDateTime(
							msg.created_at,
							"conversation",
							messages[index - 1]?.created_at
						);

						return (
							<React.Fragment key={index}>
								<span className='text-xs text-white/50 m-auto'>{date}</span>
								<div className={`flex ${msg.senderId === BOSS?.id ? 'justify-end' : 'justify-start'}`}>
									<div className={`max-w-[75%] border-white/30 border px-3 py-1.5 min-w-0 flex flex-col rounded-lg break-words ${msg.senderId === BOSS?.id ? 'bg-blue-600/20 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'
										}`}>
										<span>{msg.text}</span>
										<span className='text-xs text-white/50 self-end'>{time}</span>
									</div>
								</div>
							</React.Fragment>
						);
					})}
					<div ref={messageRef} />
				</div>
			</div>

			<div className='flex flex-col border-t border-t-white/30 p-4'>
				<div className='flex focus-within:bg-white/12 duration-200 transition-all bg-white/8 p-3 rounded-lg justify-between gap-3 focus-within:ring-2 focus-within:ring-white/18'>
					<input
						id='input-text'
						type='text'
						placeholder={t("input_placeholder")}
						value={message}
						maxLength={300}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => handleEnterPress(e)}
						className='focus:outline-none bg-transparent flex justify-around placeholder:text-white/50 w-full'
					/>
					{message.length >= 300 && (
						<div className='text-red-500 text-xs flex items-center whitespace-nowrap gap-1'>
							<AlertCircle size={12} />
							<p>{t("maximum")} 300</p>
						</div>
					)}
					<Image
						width={20}
						height={20}
						src={"/icons/send.svg"}
						alt='send icon'
						className='hover:cursor-pointer'
						onClick={sendData}
					/>
				</div>
			</div>
		</div>
	);
};

export default ConversationBody;