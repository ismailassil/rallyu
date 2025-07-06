import React from 'react'

export default function BlockButton({ onClick }) {
	return (
		<>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center
							h-11 bg-white/5 rounded-xl border border-white/8 hover:border-2 hover:bg-white/6'
							onClick={onClick}>
				<img src='/icons/user-xmark-solid.svg' className='h-[20px] w-[20px] fill'/>
				<h4 className='font-light text-lg'>Block</h4>
			</div>
		</>
	);
}
