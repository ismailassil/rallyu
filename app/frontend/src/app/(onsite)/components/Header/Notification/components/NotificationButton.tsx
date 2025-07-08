import { Bell } from "@phosphor-icons/react";
import React from "react";

const NotificationButton = () => {
	const isActive = isNotif
		? "bg-hbg border-hbbg ring-bbg scale-101 ring-4"
		: "hover:bg-hbg hover:border-hbbg hover:ring-bbg hover:scale-101 hover:ring-4";

	return (
		<>
			<button
				className={`bg-card border-br-card ml-4 flex h-[55px]
		w-[55px] items-center justify-center rounded-full border-2 hover:cursor-pointer
		${isActive} transition-transform duration-200`}
				onClick={handleNotifButton}
			>
				<Bell size={28} className={`${isNotif && "animate-pulse"}`} />
			</button>
			{newNotification && (
				<div className="absolute right-4 top-4 h-2 w-2 animate-ping rounded-full bg-red-500 ring-1 ring-red-400" />
			)}
		</>
	);
};

export default NotificationButton;
