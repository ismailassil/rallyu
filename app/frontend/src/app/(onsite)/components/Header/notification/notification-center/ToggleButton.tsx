import { BellIcon } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useHeaderContext } from "../../context/HeaderContext";

const ToggleButton = () => {
	const { notifications } = useNotification();
	const { setIsProfile, setIsSearch, setIsNotif, isNotif } = useHeaderContext();
	const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

	const handleNotifButton = () => {
		setIsProfile(false);
		setIsSearch(false);
		setIsNotif(!isNotif);
	};

	useEffect(() => {
		const isUnread = notifications.some((notif) => notif.status === "unread");
		setHasUnreadNotif(isUnread);
	}, [notifications]);

	const isActive = isNotif
		? "bg-hbg border-hbbg ring-bbg scale-101 ring-4"
		: "hover:bg-hbg hover:border-hbbg hover:ring-bbg hover:scale-101 hover:ring-4";

	return (
		<button
			className={`bg-card border-br-card relative ml-4 flex h-[55px] w-[55px] items-center justify-center rounded-full border-2 hover:cursor-pointer ${isActive} transition-transform duration-200`}
			onClick={handleNotifButton}
		>
			<BellIcon size={28} className={`${isNotif && "animate-pulse"}`} />
			{hasUnreadNotif && (
				<div className="absolute top-3 right-4 h-2.5 w-2.5 rounded-full bg-yellow-500" />
			)}
		</button>
	);
};

export default ToggleButton;
