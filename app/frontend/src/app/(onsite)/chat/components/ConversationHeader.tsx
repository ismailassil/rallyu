"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image"
import { ArrowCircleLeftIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import Avatar from '../../users/components/Avatar';
import useRequestBattleFriend from '@/app/hooks/useRequestBattleFriend';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatePresence, motion } from "framer-motion"
import Link from 'next/link';
import { Bomb, Swords, X } from 'lucide-react';

const ConversationHeader = () => {
	const [option, setOption] = useState(false);
	const { apiClient, setShowConversation, setSelectedUser, selectedUser, handleSendGame } = useChat();
	const route = useRouter();
	const { isBusy } = useAuth();
	const [timer, setTimer] = useState<boolean>(false);
	const requestBattleFriend = useRequestBattleFriend();

	const clickPlay = (event : any) => {
		setTimer(true);
		requestBattleFriend(event); 
		handleSendGame(selectedUser?.id as number);
		setOption(true);
	};
	

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
					<span className={`h-3 w-3 rounded-full ${1  ? 'bg-green-700 animate-pulse' : 'bg-red-700'}`}></span>
					<span className="text-gray-400">{1  ? 'Online' : 'Offline'}</span>  {/* check 1 */}
				</div>
			</div>
			<div className='ml-auto my-auto flex gap-4 h-8 relative items-center'>
				<AnimatePresence>
					{option ? (
						<motion.div initial={{scale: 0.8}} transition={{duration:0.5}} animate={{scale: 1}} exit={{scale:0.4}} className=' flex gap-2 items-center'>
							<X size={24} className='p-1 rounded-full bg-white/8 hover:bg-white/10
									border border-white/9 
									cursor-pointer hover:scale-105 duration-500'
								onClick={() => setOption(false)}
							/>
							<div className='w-21 h-10 grid bg-white/4 border border-white/5 grid-cols-2 *:size-full
								*:hover:bg-white/8 rounded-full *:p-[12px] overflow-hidden transition-all duration-500 divide-x divide-white/9
								*:ease-in-out *:cursor-pointer *:scale-100 *:active:scale-105'
								>
								<Image width={20} height={20} alt='ss' src={`/icons/XO.svg`}/>
								<Image width={18} height={18} alt='ss' src={`/icons/ping-pong.svg`} />
							</div>
						</motion.div>
					):
					(<div className="group/button w-10 h-10 hover:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105" onClick={clickPlay}>
						<Swords className="w-5 h-5 flex-shrink-0 transition-transform duration-600 group-hover/button:rotate-180 ease-in-out" />
						<span className="ml-3 whitespace-nowrap font-medium opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 ease-in-out">
						{/* <span className=""> */}
							Play
							{
								timer &&
								<motion.div
								className="bg-accent w-full h-full absolute -z-1 bottom-0 left-0"
								animate={{ width: 0 }}
								transition={{ duration: 10.5 }}
								onAnimationComplete={() => {setTimer(false); setOption(false);}}
								/>
							}
						</span>
					</div>)
							}
					<div className="group/button w-10 h-10 hover:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105">
						<Bomb className="w-5 h-5 flex-shrink-0 transition-transform duration-600 group-hover/button:rotate-180 ease-in-out" />
						<span className="ml-3 whitespace-nowrap font-medium opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 ease-in-out" onClick={async () => {
							await apiClient.blockUser(selectedUser?.id);
							setSelectedUser(null);
							setShowConversation(false);
						}}>
							Block
						</span>
					</div>

				</AnimatePresence>
			</div>
		</div>
	)
}

export default ConversationHeader

// setOption(false)
// window.history.pushState(null, "", `/chat`) // ====> read more about this

{/* {option && (
	<>
	<div className="absolute right-2.5 top-10 w-32 rounded-xl border border-white/20 backdrop-blur-md bg-white/10 p-3 space-y-2 z-50">
							<button className={`relative overflow-hidden w-full rounded-md py-2 bg-white/10 hover:bg-green-600
						 transition duration-300 ${isBusy ? "opacity-50 cursor-auto" : "cursor-pointer"}`}
								onClick={(event) => { setTimer(true); requestBattleFriend(event); handleSendGame(selectedUser?.id as number); }}
							>
								Play
								{
									timer &&
									<motion.div
										className="bg-accent w-full h-1 absolute bottom-0 left-0"
										animate={{ width: 0 }}
										transition={{ duration: 10.5 }}
										onAnimationComplete={() => setTimer(false)}
									/>
								}
							</button>
							<Link href={`/chat/${selectedUser?.id}`} className="group/button w-10 h-10 hover:w-23 flex items-center bg-white/4 border border-white/5 hover:bg-white/8 rounded-full p-[9px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer scale-100 active:scale-105">
								<Swords className="w-5 h-5 flex-shrink-0 transition-transform duration-600 group-hover/button:rotate-180 ease-in-out" />
								<span className="ml-3 whitespace-nowrap font-medium opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 ease-in-out">
									Play
								</span>
							</Link>
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
				)} */}