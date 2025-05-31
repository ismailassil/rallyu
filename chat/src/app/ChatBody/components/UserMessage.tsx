"use client";
import React from 'react'
import Image from 'next/image'
import { Checks } from "@phosphor-icons/react";



const UserMessage = () => {
  const user = { image: "/profile/image_1.jpg", name: "Salah Demnati", message: "Message djsdj", date: "01/01/2000", isSeen: false }
  return (
    <div className='flex gap-4 hover:cursor-pointer hover:bg-white/15 hover:rounded-lg p-2'>
      <Image width={50} height={50} src={user.image} alt='texter Image'
        className=' border-red-300 rounded-full border-2' />
      <div className='flex flex-col'>
        <span className=''>{user.name}</span>
        <span className='text-gray-400'>{user.message}</span>
      </div>
      <div className='flex flex-col ml-auto'>
        <span className='text-gray-400'>{user.date}</span>
        {!user.isSeen && <Checks width={20} height={20} className=' ml-auto'/>}
      </div>
    </div>
  )
}

export default UserMessage