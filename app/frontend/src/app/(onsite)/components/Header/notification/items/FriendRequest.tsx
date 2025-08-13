import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";

const FriendRequest = ({handleAccept, handleDecline}: {
	handleAccept: () => void
	handleDecline: () => void
}) => {
	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>Accept</FilledButton>
			<OutlineButton onClick={handleDecline}>Decline</OutlineButton>
		</div>
	);
};

export default FriendRequest;
