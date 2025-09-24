import React, { useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Button from './Button';
import { LocalUserMinusIcon, LocalUserPlusIcon, LocalUserXIcon } from './LocalIcon';

export type FriendshipStatus = 'NONE' | 'OUTGOING' | 'INCOMING' | 'FRIENDS' | null;

export default function Relations({ userId, currentStatus } : { userId: number, currentStatus: FriendshipStatus }) {
	const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(currentStatus);
	const { apiClient } = useAuth();

	if (!friendshipStatus)
		return null;

	async function executeAction(action: () => Promise<void>, next: FriendshipStatus, message: string) {
		try {
			await action();
			setFriendshipStatus(next);
			alert(message);
		} catch {
			alert('Something wrong happened!');
		}
	}

	const ACTIONS = {
		add: () => executeAction(() => apiClient.sendFriendRequest(userId), 'OUTGOING', 'Request Sent!'),
		accept: () => executeAction(() => apiClient.acceptFriendRequest(userId), 'FRIENDS', 'Request Accepted!'),
		cancel: () => executeAction(() => apiClient.cancelFriendRequest(userId), 'NONE', 'Request Canceled!'),
		reject: () => executeAction(() => apiClient.rejectFriendRequest(userId), 'NONE', 'Request Rejected!'),
		unfriend: () => executeAction(() => apiClient.unfriend(userId), 'NONE', 'Unfriended!'),
		block: () => executeAction(() => apiClient.blockUser(userId), 'NONE', 'Blocked!'),
	};

	const BUTTONS = {
		NONE: [<Button key="add" text="Add" icon={LocalUserPlusIcon} onClick={ACTIONS.add} />],
		OUTGOING: [<Button key="cancel" text="Cancel" icon={LocalUserMinusIcon} onClick={ACTIONS.cancel} />],
		INCOMING: [
			<Button key="accept" text="Accept" icon={LocalUserPlusIcon} onClick={ACTIONS.accept} />,
			<Button key="reject" text="Decline" icon={LocalUserMinusIcon} onClick={ACTIONS.reject} />,
		],
		FRIENDS: [<Button key="unfriend" text="Unfriend" icon={LocalUserMinusIcon} onClick={ACTIONS.unfriend} />],
	};

	return (
		<div className="flex gap-3">
			{BUTTONS[friendshipStatus]}
			<Button text="Block" icon={LocalUserXIcon} onClick={ACTIONS.block} />
		</div>
	);
}
