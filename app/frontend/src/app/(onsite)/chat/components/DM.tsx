"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';


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
	const { socket} = useChat();


	return (
		<div className={`flex gap-4 hover:cursor-pointer hover:bg-white/5 hover:rounded-lg p-2
      ${selectedUser?.id === user.id ? 'bg-white/15 rounded-lg' : 'bg-white/0'} w-full`}
		>
			<div className=' size-[40] md:size-[50px] flex-shrink-0 overflow-hidden rounded-full border-2 border-red-300'>
				<Image
					width={50}
					height={50}
					src={user.image}
					alt='texter Image'
					className='w-full h-full object-cover'
				/>
			</div>

			<div className='flex flex-col w-full justify-between p-0.5 min-w-0'>
				<div className='flex w-full justify-between items-center'>
					<div className='line-clamp-1 flex-1 min-w-0'>{user.name}</div>
					<div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{user.date}</div>
				</div>

				<div className='flex w-full justify-between items-center'>
					<div className='text-gray-400 text-xs md:text-sm truncate flex-1 min-w-0 max-w-[160px] md:max-w-[200px]'>
						{lastMessage}
					</div>
					<div className='size-2 flex-shrink-0 ml-2 rounded-full bg-main' />
				</div>
			</div>
		</div>
	);
};

export default DM;