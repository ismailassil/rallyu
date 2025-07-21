import React, { useState } from 'react';
import Image from 'next/image';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

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


export default function Relations({ user_id, status } : { user_id: number, status: string | null }) {
	const [friendshipStatus, setFriendshipStatus] = useState<string | null>(status);
	const { api } = useAuth();

	if (!status)
		return null;

	async function handleAdd() {
		try {
			await api.sendFriendRequest(user_id);
			setFriendshipStatus('OUTGOING');
			alert('Request Sent!');
		} catch {
			alert('Something wrong happened!');
		}
	}

	async function handleAccept() {
		try {
			await api.acceptFriendRequest(user_id);
			setFriendshipStatus('FRIENDS');
			alert('Request Accepted!');
		} catch {
			alert('Something wrong happened!');
		}
	}

	async function handleCancel() {
		try {
			await api.cancelFriendRequest(user_id);
			setFriendshipStatus('NONE');
			alert('Request Canceled!');
		} catch {
			alert('Something wrong happened!');
		}
	}

	async function handleReject() {
		try {
			await api.rejectFriendRequest(user_id);
			setFriendshipStatus('NONE');
			alert('Request Rejected!');
		} catch {
			alert('Something wrong happened!');
		}
	}

	async function handleUnfriend() {
		try {
			await api.unfriend(user_id);
			setFriendshipStatus('NONE');
			alert('Unfriended!');
		} catch {
			alert('Something wrong happened!');
		}
	}

	async function handleBlock() {
		try {
			await api.blockUser(user_id);
			setFriendshipStatus('NONE');
			alert('Blocked!');
		} catch {
			alert('Something wrong happened!');
		}
	}

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
					<Button text='Decline' icon='/icons/user-minus.svg' onClick={handleReject} />
				</>
			)}

			{friendshipStatus === 'FRIENDS' && (
				<Button text='Unfriend' icon='/icons/user-minus.svg' onClick={handleUnfriend} />
			)}
			<Button text='Block' icon='/icons/user-x.svg' onClick={handleBlock} />
		</div>
	);
}
