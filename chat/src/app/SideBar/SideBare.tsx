import React from 'react'
import Image from "next/image"


const SideBare = () => {
  return (
    <div className='flex flex-col gap-14 items-center justify-center border-4xl border border-white/30  rounded-md  max-w-20 py-32 px-5'>
        <Image width={35} height={35} src={"/navbar/Home.svg"} alt='Home image' className="hover:cursor-pointer"/>
        <Image width={35} height={35} src={"/navbar/Game.svg"} alt='Home image' className="hover:cursor-pointer"/>
        <Image width={35} height={35} src={"/navbar/Tournament.svg"} alt='Home image' className="hover:cursor-pointer"/>
        <Image width={35} height={35} src={"/navbar/Chat.svg"} alt='Home image' className="hover:cursor-pointer"/>
        <Image width={35} height={35} src={"/navbar/Settings.svg"} alt='Home image' className="hover:cursor-pointer"/>
    </div>
  )
}

export default SideBare