import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useState, useEffect } from "react";
import UserList, { UserItem, mapAPIUserItemtoUserItem } from "./UserList";
import { CircleMinus } from "lucide-react";


export default function FriendsList() {
	const { api } = useAuth();
	const [friends, setFriends] = useState<UserItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchFriends() {
		  try {
			setIsLoading(true);
			const data = await api.getAllFriends();
			const mappedFriends = mapAPIUserItemtoUserItem(data);
			setFriends(mappedFriends);
		  } catch (err) {
			alert('Error fetching friends');
			alert(err);
		  } finally {
			setIsLoading(false);
		  }
		}
		fetchFriends();
	}, []);

	async function handleUnfriend(user_id: number) {
		try {
			await api.unfriend(user_id);
			setFriends(prev => prev.filter(friend => friend.id !== user_id));
		} catch (err) {
			alert('Error unfriending');
			alert(err);
		}
	}

	if (isLoading)
		return <p>Loading friends...</p>;

	return (
		<UserList 
			users={friends}
			actions={[
				{
					icon: <CircleMinus size={22} />,
					onClick: handleUnfriend,
					title: 'Unfriend',
					color: 'red-400'
				},
			]}
		/>
	);
}