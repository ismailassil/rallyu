import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { CircleMinus, X } from "lucide-react";

export default function OutgoingFriendRequestsList() {
	const { api } = useAuth();
	const [outgoing, setOutgoing] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchOutgoingRequests() {
			try {
				setIsLoading(true);
				const data = await api.getAllOutgoingFriendRequests();
				const mappedOutgoing = mapAPIUserItemtoUserItem(data);
				setOutgoing(mappedOutgoing);
			} catch (err) {
				alert("Error fetching outgoing requests");
			} finally {
				setIsLoading(false);
			}
		}
		fetchOutgoingRequests();
	}, []);

	async function handleCancel(user_id: number) {
		try {
			await api.cancelFriendRequest(user_id);
			setOutgoing(prev => prev.filter(request => request.id !== user_id));
		} catch (err) {
			alert("Error canceling request");
		}
	}

	if (isLoading) return <p>Loading outgoing requests...</p>;

	return (
		<UserList
			users={outgoing}
			actions={[
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleCancel,
					title: "Cancel",
					color: "red-400",
				},
			]}
		/>
	);
}
