/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { PlaceholderComponent } from "@/app/(auth)/components/UI/LoadingComponents";
import useAPIQuery from "@/app/hooks/useAPIQuery";

export default function OutgoingFriendRequestsList() {
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
		function handleRelationUpdate(event: { eventType: string, data: Record<string, any> }) {
			if (!socket || !loggedInUser)
				return ;

			if (event.eventType !== 'RELATION_UPDATE')
				return ;

			if ((event.data.requesterId === loggedInUser.id || event.data.receiverId === loggedInUser.id))
				refetch();
		}

		socket.on('user', handleRelationUpdate);

		return () => {
			socket.off('user', handleRelationUpdate);
		};
	}, []);

	async function handleCancel(id: number) {
		try {
			await executeAPICall(() => apiClient.cancelFriendRequest(id));
			toastSuccess('Canceled');
		} catch (err: any) {
			toastError(err.message);
		}
	}

	const showSkeleton = isLoading && !outgoing;

	if (showSkeleton)
		return <LoadingComponent />;

	if (error)
		return <PlaceholderComponent content='Failed to load outgoing friend requests. Try Again Later.' />;

	if (!outgoing || outgoing.length === 0)
		return <PlaceholderComponent content='No outgoing friend requests found. Go touch some grass.' />;

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
