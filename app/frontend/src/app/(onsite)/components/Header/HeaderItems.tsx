"use client";

import { useEffect, useRef, useState } from "react";
import Search from "./Search";
import Notification from "./Notification/NotificationCenter";
import Profile from "./Profile";

export default function HeaderItems() {
	const [isSearch, setIsSearch] = useState(false);
	const [isProfile, setIsProfile] = useState(false);
	const [isNotif, setIsNotif] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node)
			) {
				setIsNotif((isNotif) => !isNotif);
			}
		}

		if (isNotif) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isNotif]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfile((isProfile) => !isProfile);
			}
		}

		if (isProfile) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isProfile]);

	return (
		<div className="relative flex items-center pr-6">
			<Search
				setIsNotif={setIsNotif}
				setIsProfile={setIsProfile}
				setIsSearch={setIsSearch}
				isSearch={isSearch}
			/>
			{/* NOTIFICATION ICON */}
			<Notification
				setIsNotif={setIsNotif}
				setIsProfile={setIsProfile}
				setIsSearch={setIsSearch}
				isNotif={isNotif}
				notificationRef={notificationRef}
			/>
			{/* PROFILE ICON */}
			<Profile
				setIsNotif={setIsNotif}
				setIsProfile={setIsProfile}
				setIsSearch={setIsSearch}
				isProfile={isProfile}
				profileRef={profileRef}
			/>
		</div>
	);
}
