import React from "react";
import OutlineButton from "./OutlineButton";
import FilledButton from "./FilledButton";

const FriendRequestNotification = () => {
	return (
		<div className="ml-10 flex gap-2">
			<OutlineButton>Decline</OutlineButton>
			<FilledButton>Accept</FilledButton>
		</div>
	);
};

export default FriendRequestNotification;
