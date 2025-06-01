import React from 'react'
import message from "../../Messages.json"

const Message = () => {
  return (
	<ul className="">
		{Array.from({ length: 1 }).map((_, i) => (
			<li key={i} className='max-w-max border-white/30 border p-3 rounded-lg ml-auto mb-10 relative'>
				<span className=''>{message.content}</span>
				<span className=' -bottom-6 right-0 absolute text-white/30 text-sm  w-32 text-end'>{message.date}</span>
			</li>
		))}
	</ul>
  )
}

export default Message