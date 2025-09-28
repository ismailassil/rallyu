import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { Check, CircleMinus, X } from "lucide-react";

export default function IncomingFriendRequestsList() {
	const { apiClient } = useAuth();
	const [incoming, setIncoming] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchIncomingRequests() {
			try {
				setIsLoading(true);
				const data = await apiClient.getAllIncomingFriendRequests();
				const mappedIncoming = mapAPIUserItemtoUserItem(data);
				setIncoming(mappedIncoming);
			} catch (err) {
				alert("Error fetching incoming requests");
			} finally {
				setIsLoading(false);
			}
		}
		fetchIncomingRequests();
	}, []);

	async function handleDecline(user_id: number) {
		try {
			await apiClient.rejectFriendRequest(user_id);
			setIncoming(prev => prev.filter(request => request.id !== user_id));
		} catch (err) {
			alert("Error declining request");
		}
	}

	async function handleAccept(user_id: number) {
		try {
			await apiClient.acceptFriendRequest(user_id);
			setIncoming(prev => prev.filter(request => request.id !== user_id));
		} catch (err) {
			alert("Error accepting request");
		}
	}

	if (isLoading)
		return <p>Loading incoming requests...</p>;

	return (
		<UserList
			users={incoming}
			actions={[
				{
					icon: <Check size={22} className="hover:text-blue-400 transition-all duration-300" />,
					onClick: handleDecline,
					title: "Decline",
					color: "red-400",
				},
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleAccept,
					title: "Accept",
					color: "green-400",
				},
			]}
		/>
	);
}
