"use client"
import React, { useState, useEffect, useRef, useContext } from 'react'
import Image from "next/image"
import { ArrowCircleLeftIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import {  useChat } from '../context/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

type MessageType = {
	id: number;
	senderId: number;
	receiverId: number;
	text: string;
	date: string;
}

type User = {
	id: number;
	name: string;
	message: string;
	image: string;
	date: string;
	isSeen: boolean;
	lastSeen: string;
};

const ConversationBody = ({ user, receiverId }: { user: User, receiverId: number }) => {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState<MessageType[]>([])
	const [option, setOption] = useState(false)
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { setShowConversation } = useChat();
	// const { socket } = useAuth();

	useEffect(() => {
		messageRef.current?.scrollIntoView({ behavior: 'auto' });
	}, [messages]);

	const sendData = () => { 
		const data = message.trim()
		if (data !== "") {
			const newMessage = {
				senderId: user.id,
				receiverId: receiverId,
				text: data
			};

			setMessage("");
		}
	};

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			sendData()
		}
	}

	return (
		<div className={` size-full border border-white/30 rounded-lg flex flex-col md:bg-white/5`}>
			{/* top bar and block button */}
			<div className='flex gap-4 p-4 pl-6 border-b border-b-white/30'>
				<div className='flex items-center md:hidden cursor-pointer'>
					<ArrowCircleLeftIcon size={32} onClick={() => setShowConversation(false)} />
				</div>
				<div className='relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
					<Image
						fill
						sizes='48px'
						src={user.image}
						alt={`${user.name} image`}
						className='object-cover' />
				</div>
				<div className='flex flex-col justify-center'>
					<span className='hover:cursor-pointer'>{user.name}</span>
					<div className='flex items-center gap-2'>
						<span className={`h-3 w-3 rounded-full ${1 ? 'bg-green-700 animate-pulse' : 'bg-red-700'}`}></span>
						<span className="text-gray-400">{1 ? 'Online' : 'Offline'}</span>
						{/* <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-700 animate-pulse' : 'bg-red-700'}`}></span> */}
						{/* <span className="text-gray-400">{isConnected ? 'Online' : 'Offline'}</span> */}
					</div>
				</div>
				<div className='ml-auto my-auto flex gap-4 h-8 relative'>
					<DotsThreeVerticalIcon size={32} onClick={() => setOption((prev) => !prev)} className='cursor-pointer' />
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
			{/* message body */}
			<div className='overflow-y-scroll custom-scrollbar p-4 flex-1'>
				{messages.map((msg, index) => (
					<div key={msg.id || index} ref={index === messages.length - 1 ? messageRef : null}
						className={`flex justify-end max-w-max w-9/12 border-white/30 border p-3 rounded-lg mb-10 relative break-all ${msg.senderId === user.id ? 'ml-auto' : 'mr-auto'}`}>
						<span className=''>{msg.text}</span>
						<span className={`-bottom-6 ${msg.senderId === user.id ? 'right-0' : '-left-6'} absolute text-white/30 w-32 text-end`}>{msg.date}</span>
					</div>
				))}
			</div>
			{/* typing message and send */}
			<div className='border-t border-t-white/30 p-4 mt-auto'>
				<div className='flex focus-within:bg-white/12 duration-200 transition-all bg-white/8 p-3 rounded-lg justify-between focus-within:ring-2 focus-within:ring-white/18'>
					<input
						type='text'
						placeholder="Enter your message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => handleEnterPress(e)}
						className='focus:outline-none bg-transparent flex justify-around placeholder:text-white/50 w-full' />
					<Image width={20} height={20} src={"/icons/send.svg"} alt='send image'
						className='hover:cursor-pointer' onClick={sendData} />
				</div>
			</div>
		</div>
	)
}

export default ConversationBody