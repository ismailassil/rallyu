import React from 'react'

export default function ChatButton() {
	return (
		<>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center
							h-11 bg-white/5 rounded-xl border border-white/8 hover:border-2 hover:bg-white/6'>
				<img src='/icons/message-solid.svg' className='h-[16px] w-[16px] fill'/>
				<h4 className='font-light text-lg'>Chat</h4>
			</div>
		</>
	);
}
