import React from "react";

const NotificationHeader = ({ length }: { length: number }) => {
	const title =
		length >= 1
			? `You have ${length} unread notification${length > 1 ? "s" : ""}`
			: `You have no new notifications`;

	return (
		<div className="bg-card flex w-full flex-col px-4 py-3 text-start">
			<p className="font-bold">Notification</p>
			<p className="text-gray text-xs text-gray-400">{title}</p>
		</div>
	);
};

export default NotificationHeader;
