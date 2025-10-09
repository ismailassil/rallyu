import React, { useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Button from './Button';
import { LocalUserMinusIcon, LocalUserPlusIcon, LocalUserXIcon } from './LocalIcon';
import { toastError, toastSuccess } from '@/app/components/CustomToast';

export type FriendshipStatus = 'NONE' | 'OUTGOING' | 'INCOMING' | 'FRIENDS' | 'BLOCKED' | null;

export default function Relations({ userId, currentStatus } : { userId: number, currentStatus: FriendshipStatus }) {
	const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(currentStatus);
	const { apiClient } = useAuth();

	if (!friendshipStatus)
		return null;

	async function executeAction(action: () => Promise<void>, next: FriendshipStatus, message: string) {
		try {
			await action();
			setFriendshipStatus(next);
			toastSuccess(message);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	const ACTIONS = {
		add: () => executeAction(() => apiClient.sendFriendRequest(userId), 'OUTGOING', 'Sent'),
		accept: () => executeAction(() => apiClient.acceptFriendRequest(userId), 'FRIENDS', 'Accepted'),
		cancel: () => executeAction(() => apiClient.cancelFriendRequest(userId), 'NONE', 'Canceled'),
		reject: () => executeAction(() => apiClient.rejectFriendRequest(userId), 'NONE', 'Rejected'),
		unfriend: () => executeAction(() => apiClient.unfriend(userId), 'NONE', 'Unfriended'),
		block: () => executeAction(() => apiClient.blockUser(userId), 'BLOCKED', 'Blocked'),
		unblock: () => executeAction(() => apiClient.unblockUser(userId), 'NONE', 'Unblocked'),
	};

	const BUTTONS = {
		NONE: [<Button key="add" text="Add" icon={LocalUserPlusIcon} onClick={ACTIONS.add} />],
		OUTGOING: [<Button key="cancel" text="Cancel" icon={LocalUserMinusIcon} onClick={ACTIONS.cancel} />],
		INCOMING: [
			<Button key="accept" text="Accept" icon={LocalUserPlusIcon} onClick={ACTIONS.accept} />,
			<Button key="reject" text="Decline" icon={LocalUserMinusIcon} onClick={ACTIONS.reject} />,
		],
		FRIENDS: [<Button key="unfriend" text="Unfriend" icon={LocalUserMinusIcon} onClick={ACTIONS.unfriend} />],
		BLOCKED: [<Button key="unblock" text="Unblock" icon={LocalUserXIcon} onClick={ACTIONS.unblock} />]
	};

	return (
		<div className="flex gap-3">
			{BUTTONS[friendshipStatus]}
			{friendshipStatus !== 'BLOCKED' && (
				<Button text="Block" icon={LocalUserXIcon} onClick={ACTIONS.block} />
			)}
		</div>
	);
}
