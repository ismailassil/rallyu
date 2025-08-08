"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LoggedUser } from '../types/Types';
import { useChat } from '../context/ChatContext';

const FriendsList = ({ user, selectedUser }: { user: LoggedUser | null, selectedUser: LoggedUser | null }) => {
	const { BOSS, messages } = useChat();

	const [lastMessage, setLastMessage] = useState('No messages yet');

	useEffect(() => {
		if (!user?.id || !BOSS?.id) {
			setLastMessage('No messages yet');
			return;
		}

		const usersMessages = messages.filter((msg: any) =>
			(msg.senderId === user?.id && msg.receiverId === BOSS?.id) ||
			(msg.senderId === BOSS?.id && msg.receiverId === user?.id)
		);

		if (usersMessages.length === 0) {
			setLastMessage('No messages yet');
			return;
		}


		const lastMessageByDate = usersMessages
			.sort((a: any, b: any) => Number(b.date) - Number(a.date))[usersMessages.length - 1];

		if (lastMessageByDate?.text) {
			setLastMessage(lastMessageByDate.text);
		} else {
			setLastMessage('No messages yet');
		}
	}, [user?.id, BOSS?.id, messages]);


	return (
		<div className={`flex gap-4 hover:cursor-pointer hover:bg-white/5 hover:rounded-lg p-2
			${selectedUser?.id === user?.id ? 'bg-white/15 rounded-lg' : 'bg-white/0'} w-full`}
		>
			<div className=' size-[40] md:size-[50px] flex-shrink-0 overflow-hidden rounded-full border border-white/30'>
				<Image
					width={50}
					height={50}
					src={`http://localhost:4025/api/users${user?.avatar_path}`}
					alt='texter Image'
					className='w-full h-full object-cover'
				/>
			</div>
			<div className='flex flex-col w-full justify-between p-0.5 min-w-0'>
				<div className='flex w-full justify-between items-center'>
					<div className='line-clamp-1 flex-1 min-w-0'>{user?.first_name + " " + user?.last_name}</div>
					<div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{"01/01/2000"}</div>
					{/* <div className='text-gray-400 flex-shrink-0 ml-2 text-xs min-w-0 truncate'>{user.date}</div> */}
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

export default FriendsList;