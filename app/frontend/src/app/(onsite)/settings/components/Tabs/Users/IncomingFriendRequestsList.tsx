import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import React, { useEffect } from 'react';
import UserList from './UserList';
import { Check, X } from 'lucide-react';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import LoadingComponent, {
	PlaceholderComponent,
} from '@/app/(auth)/components/UI/LoadingComponents';
import useAPIQuery from '@/app/hooks/useAPIQuery';
import { useTranslations } from 'next-intl';

export default function IncomingFriendRequestsList() {
	const t = useTranslations('placeholders.data.incoming');
	const trelcom = useTranslations('relations.common');
	const tautherr = useTranslations('auth');

	const { loggedInUser, apiClient, socket } = useAuth();

	const {
		isLoading,
		error,
		data: incoming,
		refetch,
	} = useAPIQuery(() => apiClient.user.fetchIncomingFriendRequests());

	const { executeAPICall } = useAPICall();

	useEffect(() => {
		async function handleRelationUpdate(event: { eventType: string; data: Record<string, any> }) {
			console.log('handleRelationUpdate incomingreq: ', event);
			if (!socket || !loggedInUser)
				return;
			if (
				event.eventType === 'RELATION_UPDATE' &&
				(event.data.requesterId === loggedInUser.id ||
				event.data.receiverId === loggedInUser.id) &&
				(event.data.status === 'INCOMING' ||
				event.data.status === 'NONE' || event.data.status === 'FRIENDS')
			) await refetch();
		}

		socket.on('user', handleRelationUpdate);
		return () => {
			socket.off('user', handleRelationUpdate);
		};
	}, [socket]);

	async function handleDecline(id: number) {
		try {
			await executeAPICall(() => apiClient.rejectFriendRequest(id));
			toastSuccess(trelcom('declined'));
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	async function handleAccept(id: number) {
		try {
			await executeAPICall(() => apiClient.acceptFriendRequest(id));
			toastSuccess(trelcom('accepted'));
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	const showSkeleton = isLoading && !incoming;

	if (showSkeleton) return <LoadingComponent />;

	if (error) return <PlaceholderComponent content={t('error')} />;

	if (!incoming || incoming.length === 0) return <PlaceholderComponent content={t('no-data')} />;

	return (
		<UserList
			users={incoming}
			actions={[
				{
					icon: (
						<Check
							size={22}
							className='transition-all duration-300 hover:text-blue-400'
						/>
					),
					onClick: handleAccept,
					title: 'Accept',
				},
				{
					icon: (
						<X size={22} className='transition-all duration-300 hover:text-red-400' />
					),
					onClick: handleDecline,
					title: 'Decline',
				},
			]}
		/>
	);
}
