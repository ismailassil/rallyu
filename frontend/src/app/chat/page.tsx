import React from 'react'
import SideBare from '../components/SideBare/SideBare'
import Chat from '../components/Chat/Chat'

const page = () => {
  return (
    <div className="flex gap-x-4 overflow-hidden p-6 pt-0 h-[90vh]">
    <SideBare />
    <Chat />
  </div>
  )
}

export default page