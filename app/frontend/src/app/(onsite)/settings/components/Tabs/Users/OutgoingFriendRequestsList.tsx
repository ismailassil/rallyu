import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useEffect } from "react";
import UserList from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { PlaceholderComponent } from "@/app/(auth)/components/UI/LoadingComponents";
import useAPIQuery from "@/app/hooks/useAPIQuery";
import { useTranslations } from "next-intl";

export default function OutgoingFriendRequestsList() {
	const t = useTranslations('placeholders.data.incoming');
	const trelcom = useTranslations('relations.common');
	const tautherr = useTranslations('auth');

	const {
		loggedInUser,
		apiClient,
		socket
	} = useAuth();

	const {
		isLoading,
		error,
		data: outgoing,
		refetch
	} = useAPIQuery(
		() => apiClient.user.fetchOutgoingFriendRequests()
	);

	const {
		executeAPICall
	} = useAPICall();

	useEffect(() => {
		async function handleRelationUpdate(event: { eventType: string; data: Record<string, any> }) {
			console.log('handleRelationUpdate outgoingreq: ', event);
			if (!socket || !loggedInUser)
				return;
			if (
				event.eventType === "RELATION_UPDATE" &&
				(event.data.requesterId === loggedInUser.id ||
				event.data.receiverId === loggedInUser.id) &&
				(event.data.status === 'OUTGOING' ||
				event.data.status === 'NONE' || event.data.status === 'FRIENDS')
			) await refetch();
		}

		socket.on("user", handleRelationUpdate);
		return () => {
			socket.off("user", handleRelationUpdate);
		};
	}, [socket]);

	async function handleCancel(id: number) {
		try {
			await executeAPICall(() => apiClient.cancelFriendRequest(id));
			toastSuccess(trelcom('canceled'));
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	const showSkeleton = isLoading && !outgoing;

	if (showSkeleton)
		return <LoadingComponent />;

	if (error)
		return <PlaceholderComponent content={t('error')} />;

	if (!outgoing || outgoing.length === 0)
		return <PlaceholderComponent content={t('no-data')} />;

	return (
		<UserList
			users={outgoing}
			actions={[
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleCancel,
					title: "Cancel"
				},
			]}
		/>
	);
}
