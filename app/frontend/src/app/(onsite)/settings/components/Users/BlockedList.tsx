import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { CircleMinus, X } from "lucide-react";


export default function BlockedList() {
	const { apiClient } = useAuth();
	const [blocked, setBlocked] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchBlockedUsers() {
		  try {
			setIsLoading(true);
			const data = await apiClient.getAllBlocked();
			const mappedBlocked = mapAPIUserItemtoUserItem(data);
			setBlocked(mappedBlocked);
		  } catch (err) {
			alert('Error fetching blocked users');
			alert(err);
		  } finally {
			setIsLoading(false);
		  }
		}
		fetchBlockedUsers();
	}, []);

	async function handleUnblock(user_id: number) {
		try {
			await apiClient.unblockUser(user_id);
			setBlocked(prev => prev.filter(blocked => blocked.id !== user_id));
		} catch (err) {
			alert('Error unblocking');
			alert(err);
		}
	}

	if (isLoading)
		return <p>Loading blocked...</p>;

	return (
		<UserList 
			users={blocked}
			actions={[
				{
					icon: <X size={22} className="hover:text-red-400 transition-all duration-300" />,
					onClick: handleUnblock,
					title: 'Unblock',
					color: 'red-400'
				},
			]}
		/>
	);
}