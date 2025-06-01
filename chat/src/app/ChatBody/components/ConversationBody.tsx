"use client"
import React, { useState } from 'react'
import Image from "next/image"
import user from "../../Users.json"
import Message from './Message'

const ConversationBody = () => {
	return (
		<div className=" w-11/12 border h-full border-white/30 rounded-lg flex flex-col ">


			{/* top bar and block button */}
			<div className=''>
					<div className='flex gap-4 p-4 pl-6 border-b  border-b-white/30'>
							<Image width={50} height={50} src={user.image} alt={`${user.name} image`}
								className=' border-red-300 rounded-full border-2' />
							<div className='flex flex-col'>
									<span className='hover:cursor-pointer'>{user.name}</span>
									<span className='text-gray-400'>Last seen at {user.lastSeen}</span>
							</div>
							<button className='h-8 ml-auto my-auto rounded-md px-4 bg-white/10 hover:cursor-pointer hover:bg-white/5'>Block</button>
					</div>
			</div>
			{/* message body */}
			<div className='overflow-auto custom-scrollbar p-4'>
				<Message />
			</div>
			{/* typing message and send */}
			<div className='border-t border-t-white/30 p-4 mt-auto'>
				<div className='flex bg-white/10 p-3 rounded-lg justify-between'>
					<input
						type='text'
						placeholder="Enter your message"
						className=' focus:outline-none bg-transparent flex justify-around placeholder:text-lg placeholder:text-white/50 w-full' />
					<Image 	width={20} height={20} src={"/icons/send.svg"} alt='send image'
							className='hover:cursor-pointer'/>
				</div>
			</div>
		</div>
	)
}

export default ConversationBody