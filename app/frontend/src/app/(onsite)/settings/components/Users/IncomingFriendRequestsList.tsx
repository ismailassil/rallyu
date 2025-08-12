import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { CircleMinus } from "lucide-react";

export default function IncomingFriendRequestsList() {
	const { api } = useAuth();
	const [incoming, setIncoming] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchIncomingRequests() {
			try {
				setIsLoading(true);
				const data = await api.getAllIncomingFriendRequests();
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
			await api.rejectFriendRequest(user_id);
			setIncoming(prev => prev.filter(request => request.id !== user_id));
		} catch (err) {
			alert("Error declining request");
		}
	}

	async function handleAccept(user_id: number) {
		try {
			await api.acceptFriendRequest(user_id);
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
					icon: <CircleMinus size={22} />,
					onClick: handleDecline,
					title: "Decline",
					color: "red-400",
				},
				{
					icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					),
					onClick: handleAccept,
					title: "Accept",
					color: "green-400",
				},
			]}
		/>
	);
}
