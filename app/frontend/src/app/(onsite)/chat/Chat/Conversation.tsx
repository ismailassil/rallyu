"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import user from "../../../Users.json"
import { useSocket } from './SocketContext';

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
  const messageRef = useRef<HTMLDivElement | null>(null);
  
  // Use the socket hook instead of creating new socket
  const { socket, isConnected } = useSocket();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handler for new messages
    const handleNewMessage = (data: any) => {
      const messageForDisplay = {
        id: data.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        date: new Date().toLocaleTimeString(),
      }
      console.log(`New message - receiverId: ${messageForDisplay.receiverId}`);
      setMessages(prev => [...prev, messageForDisplay]);
    };

    // Handler for initial messages load
    const handleSendMessages = (data: any) => {
      console.log('Messages received from server:', data);
      const convertedMessages = data.map((msg: MessageType) => ({
        id: msg.id,
        text: msg.text,
        date: new Date().toLocaleTimeString(),
        senderId: msg.senderId,
        receiverId: msg.receiverId
      }));
      setMessages(convertedMessages);
    };

    // Handler for connection
    const handleConnect = () => {
      console.log('Connected to server');
      socket.emit('getMessages', "Connection established");
    };

    // Set up event listeners
    socket.on('newMessage', handleNewMessage);
    socket.on('sendM', handleSendMessages);
    socket.on('connect', handleConnect);

    // If already connected, emit getMessages
    if (isConnected) {
      socket.emit('getM', "Connection established");
    }

    // Cleanup listeners
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('sendMessages', handleSendMessages);
      socket.off('connect', handleConnect);
    };
  }, [socket, isConnected]);

  const sendData = () => {
    if (message.trim() !== "" && socket && isConnected) {
      const newMessage = {
        senderId: user.id,
        receiverId: receiverId,
        text: message.trim()
      };
      
      socket.emit('sendM', newMessage);
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
		<div className="w-11/12 border h-full border-white/30 rounded-lg flex flex-col">
			{/* top bar and block button */}
				<div className='flex gap-4 p-4 pl-6 border-b border-b-white/30'>
					<div className='relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
						<Image
							fill
							sizes='48px'
							src={user.image}
							alt={`${user.name} image`}
							className=' object-cover' />
					</div>
					<div className='flex flex-col'>
						<span className='hover:cursor-pointer'>{user.name}</span>
						<span className='text-gray-400'>
							{isConnected ? 'Online' : 'Offline'}
						</span>
					</div>
					<div className='ml-auto my-auto flex gap-4 h-8'>
						<button className=' rounded-md px-4 bg-white/10 hover:cursor-pointer hover:bg-white/5'>Play</button>
						<button className=' rounded-md px-4 bg-white/10 hover:cursor-pointer hover:bg-white/5'>Block</button>
					</div>
				</div>
			{/* message body */}
			<div className='overflow-y-scroll custom-scrollbar p-4'>
					{messages.map((msg, index) => (
						<div key={index} ref={messageRef}
						className={` flex justify-end max-w-max w-9/12 border-white/30 border p-3 rounded-lg mb-10 relative break-all ${msg.senderId === user.id ? 'ml-auto' : 'mr-auto'}`}>
							<span className=''>{msg.text}</span>
							<span className={`-bottom-6 ${msg.senderId === user.id ? 'right-0' : '-left-6'} absolute text-white/30 text-sm w-32 text-end`}>{msg.date}</span>
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
						className=' focus:outline-none bg-transparent flex justify-around text-sm placeholder:text-white/50 w-full' />
					<Image width={20} height={20} src={"/icons/send.svg"} alt='send image'
						className='hover:cursor-pointer' onClick={sendData} />
				</div>
			</div>
		</div>
	)
}
export default ConversationBody