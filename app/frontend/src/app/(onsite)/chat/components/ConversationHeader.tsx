"use client"
import React, { useState } from 'react'
import Image from "next/image"
import { ArrowCircleLeftIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import Avatar from '../../(profile)/users/components/Avatar';
import useRequestBattleFriend from '@/app/hooks/useRequestBattleFriend';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from "framer-motion"

const ConversationHeader = () => {
	const [option, setOption] = useState(false);
	const { apiClient, setShowConversation, setSelectedUser, selectedUser } = useChat();
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
			<DotsThreeVerticalIcon
				size={32}
				onClick={() => setOption((prev) => !prev)}
				className='cursor-pointer'
			/>
			{option && (
				<>
					<div className="absolute right-2.5 top-10 w-32 rounded-xl border border-white/20 backdrop-blur-md bg-white/10 p-3 space-y-2 z-50">
						<button className={`relative overflow-hidden w-full rounded-md py-2 bg-white/10 hover:bg-green-600
						 transition duration-300 ${ isBusy ? "opacity-50 cursor-auto" : "cursor-pointer" }`}
						 	onClick={(event) => { setTimer(true); requestBattleFriend(event); }}
						>
							Play
							{
								timer &&
								<motion.div
									className="bg-accent w-full h-1 absolute bottom-0 left-0"
									animate={{ width: 0 }}
									transition={{ duration: 10.5 }}
									onAnimationComplete={ () => setTimer(false) }
								></motion.div>
							}
						</button>
						<button className="w-full rounded-md py-2 bg-white/10 hover:bg-red-600 
						transition duration-300 cursor-pointer"
							onClick={async () => {
								await apiClient.blockUser(selectedUser?.id)
								setOption(false)
								window.history.pushState(null, "", `/chat`) // ====> read more about this
								setSelectedUser(null)
								setShowConversation(false)
							}}
						>Block</button>
					</div>
					<div className="fixed inset-0 bg-transparent z-40" onClick={() => setOption(false)} />
				</>
			)}
		</div>
	</div>
	)
}

export default ConversationHeader