import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { CircleMinus } from "lucide-react";


export default function BlockedList() {
	const { api } = useAuth();
	const [blocked, setBlocked] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchBlockedUsers() {
		  try {
			setIsLoading(true);
			const data = await api.getAllBlocked();
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
			await api.unblockUser(user_id);
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
					icon: <CircleMinus size={22} />,
					onClick: handleUnblock,
					title: 'Unblock',
					color: 'red-400'
				},
			]}
		/>
	);
}