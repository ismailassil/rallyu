import React, { useCallback } from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

const FriendRequest = ({ actionUrl }: { actionUrl: string }) => {
	const { api } = useAuth();

	const handleAccept = useCallback(async () => {
		await api.instance
			.post(actionUrl + "?status=accept")
			.then(() => {
				console.log("ACCEPTED DONE");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [actionUrl, api.instance]);

	const handleDecline = useCallback(async () => {
		await api.instance
			.post(actionUrl + "?status=decline")
			.then(() => {
				console.log("ACCEPTED DONE");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [actionUrl, api.instance]);

	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>Accept</FilledButton>
			<OutlineButton onClick={handleDecline}>Decline</OutlineButton>
		</div>
	);
};

export default FriendRequest;
