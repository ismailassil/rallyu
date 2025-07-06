import React, { useState } from 'react';
import RelationButton from './Button';

export default function RelationsButtons() {
	const [friendshipStatus, setFriendshipStatus] = useState<'FRIENDS' | 'INCOMING' | 'OUTGOING' | 'NONE'>('NONE');

	const handleAdd = () => setFriendshipStatus("OUTGOING");
	const handleAccept = () => setFriendshipStatus("FRIENDS");
	const handleCancel = () => setFriendshipStatus('NONE');
	const handleDecline = () => setFriendshipStatus("NONE");
	const handleUnfriend = () => setFriendshipStatus("NONE");
	const handleBlock = () => setFriendshipStatus("NONE");

	return (
		<div className='flex gap-3 select-none'>
			{friendshipStatus === 'NONE' && (
				<RelationButton text="Add" icon='/icons/user-plus.svg' onClick={handleAdd} />
			)}

			{friendshipStatus === 'OUTGOING' && (
				<RelationButton text="Cancel" icon='/icons/user-minus.svg' onClick={handleCancel} />
			)}

			{friendshipStatus === 'INCOMING' && (
				<>
					<RelationButton text="Accept" icon='/icons/user-plus.svg' onClick={handleAccept} />
					<RelationButton text="Decline" icon='/icons/user-minus.svg' onClick={handleDecline} />
				</>
			)}

			{friendshipStatus === 'FRIENDS' && (
				<RelationButton text="Unfriend" icon='/icons/user-minus.svg' onClick={handleUnfriend} />
			)}
			<RelationButton text="Block" icon='/icons/user-x.svg' onClick={handleBlock} />
		</div>
	);
}
