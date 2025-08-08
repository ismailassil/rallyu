import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { NOTIFICATION_TYPE } from "../types/notifications.types";

const FriendRequest = ({handleAccept, handleDecline}: {
	handleAccept: (type: NOTIFICATION_TYPE) => void
	handleDecline: (type: NOTIFICATION_TYPE) => void
}) => {
	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={() => handleAccept("friend_request")}>Accept</FilledButton>
			<OutlineButton onClick={() => handleDecline("friend_request")}>Decline</OutlineButton>
		</div>
	);
};

export default FriendRequest;
