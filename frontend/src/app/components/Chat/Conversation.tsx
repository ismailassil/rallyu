"use client"
import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { format } from 'date-fns'
import { io, Socket } from 'socket.io-client'

type MessageType = {
	id?: number
	senderId: number
	receiverId: number
	text: string
	date: string
	sender: 'me' | 'other'
}
type User = {
	name: string;
	message: string;
	image: string;
	date: string;
	isSeen: boolean;
	lastSeen: string
};

const Conversation = ({ users }: { users: User }) => {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState<MessageType[]>([])
	const [socket, setSocket] = useState<Socket | null>(null)
	const [isConnected, setIsConnected] = useState(false)

	// You should set these based on your app's logic
	const currentUserId = 1; // Current user ID
	const targetUserId = 2;  // The user they're chatting with

	useEffect(() => {
		// Initialize socket connection
		const socketInstance = io('http://localhost:4000', {
			withCredentials: true,
			transports: ['websocket']
		});

		socketInstance.on('connect', () => {
			console.log('Connected to server');
			setIsConnected(true);
			// Request previous messages when connected
			socketInstance.emit('getMessages');
		});

		socketInstance.on('disconnect', () => {
			console.log('Disconnected from server');
			setIsConnected(false);
		});

		// Listen for previous messages
		socketInstance.on('previousMessages', (data: MessageType[]) => {
			console.log('Previous messages received:', data);
			const formattedMessages = data.map(msg => ({
				...msg,
				date: format(new Date(), 'EEEE HH:mm'), // You might want to save timestamp in DB
				sender: msg.senderId === currentUserId ? 'me' : 'other' as 'me' | 'other'
			}));
			setMessages(formattedMessages);
		});

		// Listen for new messages from server
		socketInstance.on('newMessage', (data: MessageType) => {
			console.log('New message received:', data);
			const formattedMessage = {
				...data,
				date: format(new Date(), 'EEEE HH:mm'),
				sender: data.senderId === currentUserId ? 'me' : 'other' as 'me' | 'other'

			};

			// Add message to state
			setMessages(prev => [...prev, formattedMessage]);
		});

		// Listen for errors
		socketInstance.on('error', (error) => {
			console.error('Socket error:', error);
		});

		setSocket(socketInstance);

		// Cleanup on unmount
		return () => {
			socketInstance.disconnect();
		};
	}, [targetUserId]);

	const sendData = () => {
		if (message.trim() !== "" && socket && isConnected) {
			const messageData = {
				senderId: currentUserId,
				receiverId: targetUserId,
				text: message.trim()
			};

			// Send message to server
			socket.emit('sendMessage', messageData);
			setMessage("");
		}
	}

	const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			sendData()
		}
	}

	const deleteData = () => {
		console.log("\n\n-----------\n\n")
		if (socket) {
			socket.emit('deleteMessage', messages)
		}
		setMessages([]) // ✅ Clear messages in UI
	}

	return (
		<div className="w-11/12 border h-full border-white/30 rounded-lg flex flex-col ">
			{/* top bar and block button */}
			<div className=''>
				<div className='flex gap-4 p-4 pl-6 border-b border-b-white/30'>
					<div className=' relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
						<Image
							fill
							sizes='48px'
							src={users.image}
							alt={`${users.name} image`}
							className=' object-cover' />
					</div>
					<div className='flex flex-col'>
						<span className='hover:cursor-pointer'>{users.name}</span>
						<span className='text-gray-400'>
							{isConnected ? 'Online' : 'Offline'} • Last seen at {users.lastSeen}
						</span>
					</div>
					<div className='ml-auto my-auto flex gap-4 h-8'>
						<button className=' rounded-md px-4 bg-white/10 hover:cursor-pointer hover:bg-white/5'>Play</button>
						<button className=' rounded-md px-4 bg-white/10 hover:cursor-pointer hover:bg-white/5'>Block</button>
					</div>
				</div>
			</div>

			{/* message body */}
			<div className='overflow-auto custom-scrollbar p-4'>
				{messages.map((msg, index) => (
					<div key={index}
						className={`max-w-max w-9/12 border-white/30 border p-3 rounded-lg mb-10 relative break-all ${msg.sender === 'me' ? 'ml-auto' : 'mr-auto'
							}`}>
						<span className=''>{msg.text}</span>
						<span className={`  -bottom-6 ${msg.sender === 'me' ? 'right-0' : '-left-8'} absolute text-white/30 text-sm w-32 text-end`}>
							{msg.date}
						</span>
					</div>
				))}
			</div>

			{/* typing message and send */}
			<div className='border-t border-t-white/30 p-4 mt-auto'>
				<div className='flex bg-white/10 p-3 rounded-lg justify-between'>
					<input
						type='text'
						placeholder="Enter your message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => handleEnterPress(e)}
						disabled={!isConnected}
						className=' focus:outline-none bg-transparent flex justify-around placeholder:text-lg placeholder:text-white/50 w-full' />
					<Image width={20} height={20} src={"/icons/send.svg"} alt='send image'
						className={`hover:cursor-pointer ${!isConnected ? 'opacity-50' : ''}`}
						onClick={sendData} />

					<Image width={20} height={20} src={"/icons/delete.svg"} alt='delete image'
						className={"hover:cursor-pointer fill-red-600"}
						onClick={deleteData} />
				</div>
				{!isConnected && (
					<div className='text-red-400 text-sm mt-2'>
						Disconnected from server. Trying to reconnect...
					</div>
				)}
			</div>
		</div>
	)
}

export default Conversation