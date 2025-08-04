"use client";

import Search from "./Search";
import Notification from "./notification/notification-center/NotificationCenter";
import Profile from "./Profile";

export default function HeaderItems() {
	return (
		<div className="relative flex items-center pr-6">
			<Search />
			<Notification />
			<Profile />
		</div>
	);
}
