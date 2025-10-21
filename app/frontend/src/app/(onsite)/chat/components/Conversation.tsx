"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from "next/image"
import { useChat } from '../context/ChatContext';
import moment from 'moment';
import { MessageType } from '../types/chat.types';
import { AlertCircle } from 'lucide-react';
import ConversationHeader from './ConversationHeader';

/*
	==== TO FIX ===
	--> online icon
	--> make getting  messages from database more fast
	--> clicking on chat icon shout setSelectedUser to null 
	--> block and play 
	--> check to fliter just once
	
	--> put day date in the middle of the conversation *
	--> last user get message should be in the top *
	--> add image if conversation is empty *
	--> isloading *

*/


const ConversationBody = () => {
	const [message, setMessage] = useState("");
	const { socket, BOSS, messages, selectedUser, apiClient, setMessages } = useChat();
	const [filteredMessages, setfilteredMessages] = useState<MessageType[]>([]);
	const messageRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		messageRef.current?.scrollIntoView({ behavior: 'auto' });
	}, [filteredMessages]);

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			sendData();
		}
	}
	const sendData = () => {
		const data = message.trim();

		if (data !== "" && BOSS) {
			const newMessage = {
				id: Date.now(),
				senderId: BOSS.id,
				receiverId: selectedUser?.id,
				text: data,
			};
			socket.emit('chat_send_msg', newMessage);
			setMessage("");
		}
	};

	useEffect(() => {
		if (!BOSS || !selectedUser) return;

		const filtered = messages.filter((msg) =>
			(msg.senderId === BOSS.id && msg.receiverId === selectedUser.id) ||
			(msg.senderId === selectedUser.id && msg.receiverId === BOSS.id)
		);
		setfilteredMessages(filtered);
	}, [messages, selectedUser?.id, BOSS?.id]);

	const setDate = (currentMsg: string, prevMsg?: string): string => {
		const currentDate = moment(currentMsg);
		const prevDate = prevMsg ? moment(prevMsg) : null;


		if (prevDate && prevDate.isSame(currentDate, "day")) {
			return "";
		}

		if (currentDate.isSame(moment(), "day")) {
			return "Today";
		} else if (currentDate.isSame(moment().subtract(1, "day"), "day")) {
			return "Yesterday";
		} else {
			return currentDate.format("MMMM DD, YYYY");
		}
	};

	return (
		<div className={` size-full border border-white/30 rounded-lg flex flex-col md:bg-white/4 `}>

			{/* ----------------------------------------------------top bar and block button ---------------------------------------------------- */}

			<ConversationHeader />

			{/* ----------------------------------------------------message body ---------------------------------------------------- */}

			<div className='overflow-y-auto custom-scrollbar p-4 flex-1 overflow-x-hidden flex flex-col justify-end mb-2'>
				<div className='flex flex-col gap-4 min-h-0'>
					{filteredMessages.map((msg, index) => (
						<React.Fragment key={index}>
							<span className='text-xs text-white/50 m-auto'>{setDate(msg.created_at, filteredMessages[index - 1]?.created_at)}</span>
							<div
								className={`flex ${msg.senderId === BOSS?.id ? 'justify-end' : 'justify-start'}`}>
								<div className={`max-w-[75%] border-white/30 border px-3 py-1.5 min-w-0 flex flex-col rounded-lg  break-words ${msg.senderId === BOSS?.id ? 'bg-blue-600/20 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}>
									<span>{msg.text}</span>
									<span className='text-xs text-white/50 self-end'>{moment.utc(msg.created_at).local().format('HH:mm')}</span>
								</div>
							</div>

						</React.Fragment>
					))}
					<div ref={messageRef} />
				</div>
			</div>

			{/* ----------------------------------------------------typing message and send ---------------------------------------------------- */}

			<div className=' flex flex-col border-t border-t-white/30 p-4 '>
				<div className='flex focus-within:bg-white/12 duration-200 transition-all bg-white/8 p-3 rounded-lg justify-between gap-3 focus-within:ring-2 focus-within:ring-white/18'>
					<input
						id='input-text'
						type='text'
						placeholder="Enter your message"
						value={message}
						maxLength={300}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => handleEnterPress(e)}
						className='focus:outline-none bg-transparent flex justify-around placeholder:text-white/50 w-full' />
					{message.length >= 300 &&
						<div className=' text-red-500 text-xs flex items-center whitespace-nowrap gap-1'>
							<AlertCircle size={12} />
							<p>Max 300</p>
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
	)
}


export default ConversationBody