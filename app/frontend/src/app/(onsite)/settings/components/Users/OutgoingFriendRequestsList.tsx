import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { EmptyComponent } from "@/app/(auth)/components/shared/ui/LoadingComponents";

export default function OutgoingFriendRequestsList() {
	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const [outgoing, setOutgoing] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchOutgoingRequests() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.getAllOutgoingFriendRequests());
				// const data = await apiClient.getAllFriends();
				setOutgoing(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toastError(err.message);
				setError('Failed to load outgoing friend requests.');
			} finally {
				setIsLoading(false);
			}
		}
		fetchOutgoingRequests();
	}, [apiClient, executeAPICall]);

	async function handleCancel(id: number) {
		try {
			await apiClient.unfriend(id);
			setOutgoing(prev => prev.filter(item => item.id !== id));
			toastSuccess('Canceled');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	if (isLoading)
		return <LoadingComponent />;

	if (error)
		return <EmptyComponent content={error} />;

	if (!outgoing)
		return null;

	if (outgoing.length === 0)
		return <EmptyComponent content='No outgoing friend requests found. Go touch some grass.' />;

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
