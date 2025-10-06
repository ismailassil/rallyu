import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { EmptyComponent } from "@/app/(auth)/components/shared/ui/LoadingComponents";

export default function FriendsList() {
	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const [friends, setFriends] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchFriends() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.getAllFriends());
				// const data = await apiClient.getAllFriends();
				setFriends(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toastError(err.message);
				setError('Failed to load friends.');
			} finally {
				setIsLoading(false);
			}
		}

		fetchFriends();
	}, [apiClient, executeAPICall]);

	async function handleUnfriend(id: number) {
		try {
			await apiClient.unfriend(id);
			setFriends(prev => prev.filter(friend => friend.id !== id));
			toastSuccess('Unfriended');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	if (isLoading)
		return <LoadingComponent />;

	if (error)
		return <EmptyComponent content={error} />;

	if (!friends)
		return null;

	if (friends.length === 0)
		return <EmptyComponent content='No friends found. Go touch some grass.' />;

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