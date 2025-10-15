"use client"
import React, { useState } from 'react'
import Image from "next/image"
import { ArrowCircleLeftIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import Avatar from '../../users/components/Avatar';
import useRequestBattleFriend from '@/app/hooks/useRequestBattleFriend';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from "framer-motion"
import Link from 'next/link';
import { Swords, UserX } from 'lucide-react';

const ConversationHeader = () => {
	const [option, setOption] = useState(false);
	const { setShowConversation, setSelectedUser, selectedUser, handleSendGame } = useChat();
	const route = useRouter();
	const { isBusy } = useAuth();
	const [timer, setTimer] = useState<boolean>(false);
	const requestBattleFriend = useRequestBattleFriend();

	return (
		<div className='flex justify-start gap-4 p-4 pl-6 border-b border-b-white/30'>
			<div className='flex items-center md:hidden cursor-pointer'>
				<ArrowCircleLeftIcon
					size={28}
					onClick={() => { setShowConversation(false); route.replace('/chat'); setSelectedUser(null) }}
				/>
			</div>
			<div className='relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border border-white/30'>
				<Avatar
					avatar={selectedUser?.avatar_url}
					alt={`${selectedUser?.first_name + " " + selectedUser?.last_name} avatar`}
					className='w-full h-full'
				/>
			</div>
			<div className='flex flex-col justify-center'>
				<span className='hover:cursor-pointer' onClick={() => route.push(`/users/${selectedUser?.username}`)}>
					{selectedUser?.first_name + " " + selectedUser?.last_name}
				</span>
				<div className='flex items-center gap-2'>
					<span className={`h-3 w-3 rounded-full ${1 ? 'bg-green-700 animate-pulse' : 'bg-red-700'}`}></span>
					<span className="text-gray-400">{1 ? 'Online' : 'Offline'}</span>
				</div>
			</div>
			<div className='ml-auto my-auto flex gap-4 h-8 relative'>

				<div className={`w-10 h-10 hover:w-20 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105 `}
					onMouseEnter={() => setOption(true)}
					onMouseLeave={() => setOption(false)}
					onClick={(event) => { setTimer(true); requestBattleFriend(event); handleSendGame(selectedUser?.id as number); }}>
					<Swords className={`${option ? `hidden` : ``}`} />
					{option && <div className=' flex justify-between items-center w-full '>
						<Link href={`/chat`}>
							<Image width={24} height={24} alt='XO icon' src={`/icons/XO.svg`} />
						</Link>
						<Link href={`/chat`}>
							<Image width={24} height={24} alt='ping pong icon' src={`/icons/ping-pong.svg`} />
						</Link>
					</div>}
					{
						timer &&
						<motion.div
							className="bg-accent w-full h-1 absolute -z-1 bottom-0 left-0"
							animate={{ width: 0 }}
							transition={{ duration: 10.5 }}
							onAnimationComplete={() => { setTimer(false); }}
						/>
					}
				</div>

				<Link href={`/chat`} className="group/button w-10 h-10 hovfer:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden 	transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105"
					onClick={async () => {
						// await apiClient.blockUser(selectedUser?.id)
						setSelectedUser(null)
						setShowConversation(false)
					}}>
					<UserX className='' />
				</Link>

			</div>
		</div>
	)
}

export default ConversationHeader