"use client";
import Image from 'next/image';
import { Checks } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

type User = {
  name: string;
  id: number;
  message: string;
  image: string;
  date: string;
  isSeen: boolean;
  lastSeen: string
};

const DM = ({ user }: { user: User }) => {
  const [lastMessage, setLastMessage] = useState('');
  // Use the custom hook instead of useContext
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available');
      return;
    }

    // Define handlers
    const handleLastMessageResult = (data: any) => {
      if (data.senderId === user.id || data.receiverId === user.id) {
        setLastMessage(data.text);
        // console.log('Last message updated for user:', user.name, data);
      }
    };

    const handleNewMessage = (data: any) => {
      if (data.senderId === user.id || data.receiverId === user.id) {
        setLastMessage(data.text);
        // console.log('New message for user:', user.name, data);
      }
    };

    // Set up listeners
    socket.on("lastMessageResult", handleLastMessageResult);
    socket.on("newMessage", handleNewMessage);

    // Emit request if connected
    if (isConnected) {
      socket.emit('lastMessage');
    }

    // Cleanup
    return () => {
      socket.off("lastMessageResult", handleLastMessageResult);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isConnected, user.id, user.name]);

  return (
    <div className='flex gap-4 hover:cursor-pointer hover:bg-white/15 hover:rounded-lg p-2'>
      <div className='relative w-[50px] h-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
        <Image
          width={50}
          height={50}
          src={user.image}
          alt='texter Image'
          className=' w-full h-full object-cove'
        />
      </div>
      <div className='flex flex-col'>
        <span>{user.name}</span>
        <span className='text-gray-400 h-6 truncate max-w-24 text-sm'>
          {lastMessage || user.message}
        </span>
      </div>
      <div className='flex flex-col ml-auto'>
        <span className='text-sm text-gray-400'>{user.date}</span>
        {!user.isSeen && (
          <Checks
            width={16}
            height={16}
            className='fill-blue-400 ml-auto'
          />
        )}
      </div>
    </div>
  );
};

export default DM;