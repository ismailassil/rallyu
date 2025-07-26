import React from 'react'
import SideBar from '../components/SideBare/SideBare'
import Chat from '../components/Chat/Chat'

const page = () => {
  return (
    <div className="flex gap-x-4 overflow-hidden p-6 pt-0 h-[90vh]">
    <SideBar />
    <Chat />
  </div>
  )
}

export default page