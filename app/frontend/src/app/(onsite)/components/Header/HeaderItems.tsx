"use client";

import Search from "./Search";
import Notification from "./Notification/NotificationCenter";
import Profile from "./Profile";

export default function HeaderItems() {
	return (
		<div className="relative flex items-center pr-6">
			<Search />
			{/* NOTIFICATION ICON */}
			<Notification />
			{/* PROFILE ICON */}
			<Profile />
		</div>
	);
}
