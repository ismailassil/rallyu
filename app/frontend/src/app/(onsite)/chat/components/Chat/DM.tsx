"use client";
import Image from 'next/image';
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

const DM = ({ user, selectedUser }: { user: User, selectedUser: User | null }) => {
  const [lastMessage, setLastMessage] = useState('');
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available');
      return;
    }

    const handleLastMessageResult = (data: any) => {
      if (data.senderId === user.id || data.receiverId === user.id) {
        setLastMessage(data.text);
      }
    };

    const handleNewMessage = (data: any) => {
      if (data.senderId === user.id || data.receiverId === user.id) {
        setLastMessage(data.text);
      }
    };

    socket.on("lastMessageResult", handleLastMessageResult);
    socket.on("newMessage", handleNewMessage);

    if (isConnected) {
      socket.emit('lastMessage');
    }

    return () => {
      socket.off("lastMessageResult", handleLastMessageResult);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, isConnected, user.id, user.name]);

  return (
    <div className={`flex gap-4 hover:cursor-pointer hover:bg-white/5 hover:rounded-lg p-2 ${selectedUser?.id === user.id ? 'bg-white/15 rounded-lg' : 'bg-white/0'}`}>
      <div className='relative w-[50px] h-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
        <Image
          width={50}
          height={50}
          src={user.image}
          alt='texter Image'
          className='w-full h-full object-cover'
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
          <span className=' ml-auto mt-2.5 h-3 w-3 inline-block shrink-0 rounded-full bg-main'></span>
        )}
      </div>
    </div>
  );

};

export default DM;