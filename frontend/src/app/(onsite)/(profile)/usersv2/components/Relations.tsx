import React, { useState } from 'react';
import Image from 'next/image';
import funnelDisplay from '@/app/fonts/FunnelDisplay';

function Button({ text, icon, onClick } : { text: string, icon: string, onClick: () => void } ) {
	return (
		<>
			<div className={`flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center ${funnelDisplay.className}
							h-11 bg-white/4 rounded-xl border border-white/10 backdrop-blur-2xl transition-all duration-200
							hover:bg-white/6 hover:scale-102`}
				 onClick={onClick}
			>
				<Image
					alt={text}
					src={icon}
					height={20}
					width={20}
				>
				</Image>
				<p className='text-[16px] sm:text-lg text-white/85'>{text}</p>
			</div>
		</>
	);
}


export default function Relations({ status } : { status: string | null }) {
	const [friendshipStatus, setFriendshipStatus] = useState<'FRIENDS' | 'INCOMING' | 'OUTGOING' | 'NONE'>('NONE');

	if (!status)
		return null;

	const handleAdd = () => setFriendshipStatus('OUTGOING');
	const handleAccept = () => setFriendshipStatus('FRIENDS');
	const handleCancel = () => setFriendshipStatus('NONE');
	const handleDecline = () => setFriendshipStatus('NONE');
	const handleUnfriend = () => setFriendshipStatus('NONE');
	const handleBlock = () => {
		setFriendshipStatus('NONE');
		alert('Blocked!');
	};

	return (
		<div className='flex gap-3 select-none'>
			{friendshipStatus === 'NONE' && (
				<Button text='Add' icon='/icons/user-plus.svg' onClick={handleAdd} />
			)}

			{friendshipStatus === 'OUTGOING' && (
				<Button text='Cancel' icon='/icons/user-minus.svg' onClick={handleCancel} />
			)}

			{friendshipStatus === 'INCOMING' && (
				<>
					<Button text='Accept' icon='/icons/user-plus.svg' onClick={handleAccept} />
					<Button text='Decline' icon='/icons/user-minus.svg' onClick={handleDecline} />
				</>
			)}

			{friendshipStatus === 'FRIENDS' && (
				<Button text='Unfriend' icon='/icons/user-minus.svg' onClick={handleUnfriend} />
			)}
			<Button text='Block' icon='/icons/user-x.svg' onClick={handleBlock} />
		</div>
	);
}
