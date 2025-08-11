"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from "next/image"
import { ArrowCircleLeftIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useChat } from '../context/ChatContext';
import moment from 'moment';
import { LoggedUser, MessageType } from '../types/Types';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';




const ConversationBody = ({ selectedUser }: { selectedUser: LoggedUser }) => {
	const [message, setMessage] = useState("");
	const [option, setOption] = useState(false);
	const { socket, BOSS, messages, setShowConversation, setSelectedUser } = useChat();
	const [filteredMessages, setfilteredMessages] = useState<MessageType[]>([]);
	const messageRef = useRef<HTMLDivElement | null>(null);
	const route = useRouter();

	useEffect(() => {
		messageRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [filteredMessages]);

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			sendData();
		}
	}
	// fix wehn click on chat icon should reset selected user


	const sendData = () => {
		const data = message.trim();

		if (data !== "" && BOSS) {
			const newMessage = {
				id: Date.now(),
				senderId: BOSS.id,
				receiverId: selectedUser.id,
				text: data,
			};
			socket.emit('chat_send_msg', newMessage);
			setMessage("");
		}
	};

	// const setDate = (msg: MessageType): string => {
	// 	const date = moment.parseZone(msg.created_at);
	// 	const now = moment();

	// 	if (date.isSame(now, 'day')) {
	// 		return date.format('HH:mm');
	// 	}
	// 	if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
	// 		return 'Yesterday';
	// 	}
	// 	if (date.isSame(now, 'year')) {
	// 		return date.format('DD-MM');
	// 	}
	// 	return date.format('DD/MM/YYYY');
	// };






	useEffect(() => {
		if (!BOSS || !selectedUser) return;

		const filtered = messages.filter((msg) =>
			(msg.senderId === BOSS.id && msg.receiverId === selectedUser.id) ||
			(msg.senderId === selectedUser.id && msg.receiverId === BOSS.id)
		);
		setfilteredMessages(filtered);
	}, [messages, selectedUser?.id, BOSS?.id]);


	return (
		<div className={` size-full border border-white/30 rounded-lg flex flex-col md:bg-white/4 `}>

			{/* ----------------------------------------------------top bar and block button ---------------------------------------------------- */}

			<div className='flex gap-4 p-4 pl-6 border-b border-b-white/30'>
				<div className='flex items-center md:hidden cursor-pointer'>
					<ArrowCircleLeftIcon
						size={28}
						onClick={() => {setShowConversation(false); route.replace('/chat'); setSelectedUser(null) }}
					/>
				</div>
				<div className='relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border border-white/30'>
					<Image
						fill
						sizes='48px'
						src={`http://localhost:4025/api/users${selectedUser.avatar_path}`}
						alt={`${selectedUser.first_name + " " + selectedUser.last_name} image`}
						className='object-cover'
					/>
				</div>
				<div className='flex flex-col justify-center'>
					<span className='hover:cursor-pointer'>{selectedUser.first_name + " " + selectedUser.last_name}</span>
					<div className='flex items-center gap-2'>
						<span className={`h-3 w-3 rounded-full ${1 ? 'bg-green-700 animate-pulse' : 'bg-red-700'}`}></span>
						<span className="text-gray-400">{1 ? 'Online' : 'Offline'}</span>
					</div>
				</div>
				<div className='ml-auto my-auto flex gap-4 h-8 relative'>
					<DotsThreeVerticalIcon
						size={32}
						onClick={() => setOption((prev) => !prev)}
						className='cursor-pointer'
					/>
					{option && (
						<>
							<div className="absolute right-2.5 top-10 w-32 rounded-xl border border-white/20 backdrop-blur-md bg-white/10 p-3 space-y-2 z-50">
								<button className="w-full rounded-md py-2 bg-white/10 hover:bg-green-600 hover:text-white transition duration-300 cursor-pointer">Play</button>
								<button className="w-full rounded-md py-2 bg-white/10 hover:bg-red-600 hover:text-white transition duration-300 cursor-pointer">Block</button>
							</div>
							<div className="fixed inset-0 bg-transparent z-40" onClick={() => setOption(false)} />
						</>
					)}
				</div>
			</div>

			{/* ----------------------------------------------------message body ---------------------------------------------------- */}

			<div className='overflow-y-auto custom-scrollbar p-4 flex-1 overflow-x-hidden flex flex-col justify-end'>
				<div className='flex flex-col gap-4 min-h-0'>
					{filteredMessages.map((msg, index) => (
						<div key={index}
							className={`flex ${msg.senderId === BOSS?.id ? 'justify-end' : 'justify-start'}`}>
							<div className={`max-w-[75%] border-white/30 border p-3 rounded-lg relative break-words ${msg.senderId === BOSS?.id ? 'bg-blue-600/20 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`}>
								<span className='block'>{msg.text}</span>
								<span className='text-xs text-white/50 mt-1 block text-right'>{moment.utc(msg.created_at).local().format('HH:mm')}</span>
							</div>
						</div>
					))}
					<div ref={messageRef} />
				</div>
			</div>
			{/* ----------------------------------------------------typing message and send ---------------------------------------------------- */}

			<div className=' flex flex-col border-t border-t-white/30 p-4 mt-auto'>
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
						alt='send image'
						className='hover:cursor-pointer' onClick={sendData}
					/>
				</div>
			</div>
		</div>
	)
}


export default ConversationBody