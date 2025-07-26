"use client";
import Image from 'next/image';
import { Checks } from "@phosphor-icons/react";
import { io } from "socket.io-client"
import { useState, useEffect } from 'react';

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

  const [lastMessage, setLastMessage] = useState(''); // Use state instead of let
  
  useEffect(() => {
    const socketInstance = io('http://localhost:4000');
    
    // Set up the listener first
    socketInstance.on('connect', () => {
      // Just emit the event, don't pass a callback
      console.log("HERKLJQKLWEJKLQWJELKQWJEKLJQWEKLJ")
      socketInstance.emit('lastMessage');
      socketInstance.on("lastMessageResult", (data) => {
        setLastMessage(data.text); // Update state
        console.log(data)
      });
      
    });
    
    // Cleanup function
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className='flex gap-4 hover:cursor-pointer hover:bg-white/15 hover:rounded-lg p-2'>
      <div className='relative w-[50px] h-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
        <Image
          width={50}
          height={50}
          src={user.image}
          alt='texter Image'
          className=' w-full h-full'
        />
      </div>
      <div className='flex flex-col'>
        <span>{user.name}</span>
        <span className='text-gray-400 h-6 truncate max-w-32 text-sm'>{lastMessage}</span>
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