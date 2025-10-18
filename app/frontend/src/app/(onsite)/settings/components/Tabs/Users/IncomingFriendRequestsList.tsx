import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem } from "./UserList";
import { Check, X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, { EmptyComponent } from "@/app/(auth)/components/UI/LoadingComponents";

export default function IncomingFriendRequestsList() {
	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const [incoming, setIncoming] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchIncomingRequests() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.user.fetchIncomingFriendRequests());
				setIncoming(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toastError(err.message);
				setError('Failed to load incoming friend requests.');
			} finally {
				setIsLoading(false);
			}
		}
		fetchIncomingRequests();
	}, [apiClient, executeAPICall]);

	async function handleDecline(id: number) {
		try {
			await apiClient.rejectFriendRequest(id);
			setIncoming(prev => prev.filter(item => item.id !== id));
			toastSuccess('Rejected');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	async function handleAccept(id: number) {
		try {
			await apiClient.acceptFriendRequest(id);
			setIncoming(prev => prev.filter(item => item.id !== id));
			toastSuccess('Accepted');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	}

	if (isLoading)
		return <LoadingComponent />;

	if (error)
		return <EmptyComponent content={error} />;

	if (!incoming)
		return null;

	if (incoming.length === 0)
		return <EmptyComponent content='No incoming friend requests found. Go touch some grass.' />;

	return (
		<UserList
			users={incoming}
			actions={[
				{
					icon: <Check size={22} className="hover:text-blue-400 transition-all duration-300" />,
					onClick: handleAccept,
					title: "Accept",
				},
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleDecline,
					title: "Decline"
				},
			]}
		/>
	);
}
