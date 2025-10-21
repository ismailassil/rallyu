import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Button from './Button';
import { LocalChatIcon, LocalUserMinusIcon, LocalUserPlusIcon, LocalUserXIcon } from './LocalIcon';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export type FriendshipStatus = 'NONE' | 'OUTGOING' | 'INCOMING' | 'FRIENDS' | 'BLOCKED' | null;

interface RelationsProps {
	username: string;
	userId: number;
	currentStatus: FriendshipStatus;
}

export default function Relations({ userId, username, currentStatus } : RelationsProps) {
	const t = useTranslations('relations.common');

	const router = useRouter();

	const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(currentStatus);
	const {
		loggedInUser,
		apiClient,
		socket
	} = useAuth();

	useEffect(() => {
		if (!loggedInUser || loggedInUser.id === userId)
			return ;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function handleRelationUpdate(event: { eventType: string, data: Record<string, any> }) {
			console.group('/********** RELATION UPDATE **********/');

			console.log('EVENT: ', event);

			if (event.eventType !== 'RELATION_UPDATE')
				return ;
			console.log('loggedInUserId', loggedInUser?.id);
			if (event.data.status === 'BLOCKED' && event.data.receiverId === loggedInUser?.id) {
				router.push('/404');
				console.groupEnd();
				return ;
			}
			setFriendshipStatus(event.data.status);


			console.groupEnd();
		}

		socket.on('user', handleRelationUpdate);

		return () => {
			socket.off('user', handleRelationUpdate);
		};
	}, [loggedInUser, router, socket, userId]);

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
		add: () => executeAction(() => apiClient.sendFriendRequest(userId), 'OUTGOING', t('sent')),
		accept: () => executeAction(() => apiClient.acceptFriendRequest(userId), 'FRIENDS', t('accepted')),
		cancel: () => executeAction(() => apiClient.cancelFriendRequest(userId), 'NONE', t('canceled')),
		reject: () => executeAction(() => apiClient.rejectFriendRequest(userId), 'NONE', t('declined')),
		unfriend: () => executeAction(() => apiClient.unfriend(userId), 'NONE', t('unfriended')),
		block: () => executeAction(() => apiClient.blockUser(userId), 'BLOCKED', t('blocked')),
		unblock: () => executeAction(() => apiClient.unblockUser(userId), 'NONE', t('unblocked')),
	};

	const BUTTONS = {
		NONE: [<Button key="add" text={t('add')} icon={LocalUserPlusIcon} onClick={ACTIONS.add} />],
		OUTGOING: [<Button key="cancel" text={t('cancel')} icon={LocalUserMinusIcon} onClick={ACTIONS.cancel} />],
		INCOMING: [
			<Button key="accept" text={t('accept')} icon={LocalUserPlusIcon} onClick={ACTIONS.accept} />,
			<Button key="reject" text={t('decline')} icon={LocalUserMinusIcon} onClick={ACTIONS.reject} />,
		],
		FRIENDS: [<Button key="chat" text='Chat' icon={LocalChatIcon} onClick={() => router.push(`/chat/${username}`) } />, <Button key="unfriend" text={t('unfriend')} icon={LocalUserMinusIcon} onClick={ACTIONS.unfriend} />],
		BLOCKED: [<Button key="unblock" text={t('unblock')} icon={LocalUserXIcon} onClick={ACTIONS.unblock} />]
	};

	return (
		<div className="flex gap-3">
			{BUTTONS[friendshipStatus]}
			{friendshipStatus !== 'BLOCKED' && (
				<Button text={t('block')} icon={LocalUserXIcon} onClick={ACTIONS.block} />
			)}
		</div>
	);
}
