import { Checks } from "@phosphor-icons/react";
import React from "react";
import { useNotification } from "../provider/NotifContext";

const NotificationFooter = () => {
	const { notifications } = useNotification();

	return (
		<>
			{notifications.length >= 1 && (
				<div className="bg-card top-0 z-20 flex w-full justify-between px-4 py-3 text-start">
					<button className="flex cursor-pointer items-end gap-1.5 text-xs hover:underline">
						<Checks size={18} />
						Mark all as read
					</button>
					<button className="flex cursor-pointer items-end gap-2 text-xs hover:underline">
						Clear All
					</button>
				</div>
			)}
		</>
	);
};

export default NotificationFooter;
