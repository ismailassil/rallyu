import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { EmptyComponent } from "@/app/(auth)/components/shared/ui/LoadingComponents";


export default function BlockedList() {
	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const [blocked, setBlocked] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchBlockedUsers() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.getAllBlocked());
				// const data = await apiClient.getAllFriends();
				setBlocked(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toastError(err.message);
				setError('Failed to load blocked users.');
			} finally {
				setIsLoading(false);
			}
		}
		fetchBlockedUsers();
	}, [apiClient, executeAPICall]);

	async function handleUnblock(id: number) {
		try {
			await apiClient.unfriend(id);
			setBlocked(prev => prev.filter(item => item.id !== id));
			toastSuccess('Unblocked');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	if (isLoading)
		return <LoadingComponent />;

	if (error)
		return <EmptyComponent content={error} />;

	if (!blocked)
		return null;

	if (blocked.length === 0)
		return <EmptyComponent content='No blocked users found. Go block some.' />;

	return (
		<UserList 
			users={blocked}
			actions={[
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleUnblock,
					title: 'Unblock'
				},
			]}
		/>
	);
}