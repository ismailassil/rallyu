import React, { useCallback } from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

const FriendRequest = ({ id }: { id: number }) => {
	const { api } = useAuth();

	const handleAccept = useCallback(async () => {
		await api.sendFriendRequest(id);
	}, [api, id]);

	const handleDecline = useCallback(async () => {
		await api.rejectFriendRequest(id);
	}, [api, id]);

	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>Accept</FilledButton>
			<OutlineButton onClick={handleDecline}>Decline</OutlineButton>
		</div>
	);
};

export default FriendRequest;
