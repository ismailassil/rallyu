import { ChecksIcon } from "@phosphor-icons/react";
import React, { useCallback } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

const Footer = () => {
	const { notifications, setNotifications } = useNotification();
	const { api } = useAuth();

	const handleClearAll = useCallback(() => {
		api.instance
			.put("/notif/update", {
				notificationId: -1,
				scope: "all",
				status: "dismissed",
			})
			.then((value) => {
				setNotifications([]);
				console.log(value.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [api.instance, setNotifications]);

	const handleMarkAll = useCallback(() => {
		api.instance
			.put("/notif/update", {
				notificationId: -1,
				scope: "all",
				status: "read",
			})
			.then((value) => {
				setNotifications((prev) =>
					prev.map((notif) =>
						notif.status === "unread" ? { ...notif, status: "read" } : notif
					)
				);
				console.log(value.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [api.instance, setNotifications]);

	return (
		<>
			{notifications.length >= 1 && (
				<div className="bg-card top-0 z-20 flex w-full justify-between px-4 py-3 text-start *:transition-all *:duration-300 *:hover:text-gray-300">
					<button
						className="flex cursor-pointer items-end gap-1.5 text-xs hover:underline"
						onClick={handleMarkAll}
					>
						<ChecksIcon size={18} />
						Mark all as read
					</button>
					<button
						className="flex cursor-pointer items-end gap-2 text-xs hover:underline"
						onClick={handleClearAll}
					>
						Clear All
					</button>
				</div>
			)}
		</>
	);
};

export default Footer;
