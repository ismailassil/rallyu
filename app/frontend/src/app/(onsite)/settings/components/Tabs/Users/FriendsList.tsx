/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { PlaceholderComponent } from "@/app/(auth)/components/UI/LoadingComponents";
import useAPIQuery from "@/app/hooks/useAPIQuery";
import { useTranslations } from "next-intl";

export default function FriendsList() {
	const t = useTranslations('placeholders.data.friends');

	const {
		loggedInUser,
		apiClient,
		socket
	} = useAuth();

	const {
		isLoading,
		error,
		data: friends,
		refetch
	} = useAPIQuery(
		() => apiClient.user.fetchFriends()
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

	async function handleUnfriend(id: number) {
		try {
			await executeAPICall(() => apiClient.user.unfriend(id));
			toastSuccess('Unfriended');
		} catch (err: any) {
			toastError(err.message);
		}
	}

	const showSkeleton = isLoading && !friends;

	if (showSkeleton)
		return <LoadingComponent />;

	if (error)
		return <PlaceholderComponent content={t('error')} />;

	if (!friends || friends.length === 0)
		return <PlaceholderComponent content={t('no-data')} />;

	return (
		<UserList
			users={friends}
			actions={[
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleUnfriend,
					title: 'Unfriend'
				},
			]}
		/>
	);
}
