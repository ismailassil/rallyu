import { Checks } from "@phosphor-icons/react";
import React from "react";
import { useNotification } from "../context/NotifContext";

const NotificationFooter = () => {
	const { notifications } = useNotification();

	function handleClearAll() {
		// ? The Response from the Socket Will Handle it
		// setNotifications([]);
		// TODO: Uncomment this
		// axios
		// 	.put("http://localhost:4025/api/notif/update", {
		// 		username: "iassil",
		// 		all: true,
		// 		status: "dismissed",
		// 	})
		// 	.then((value) => {
		// 		console.log(value.data);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}

	function handleMarkAll() {
		// ? The Response from the Socket Will Handle it
		// setNotifications((prev) =>
		// 	prev.map((notif) => (notif.status === "unread" ? { ...notif, status: "read" } : notif))
		// );
		// TODO: Uncomment this
		// axios
		// 	.put("http://localhost:4025/api/notif/update", {
		// 		status: "read",
		// 		all: true,
		// 		username: "iassil",
		// 	})
		// 	.then((value) => {
		// 		console.log(value.data);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}

	return (
		<>
			{notifications.length >= 1 && (
				<div
					className="bg-card *:duration-300 *:transition-all *:hover:text-gray-300 top-0 z-20 flex w-full
						justify-between px-4 py-3 text-start"
				>
					<button
						className="flex cursor-pointer items-end gap-1.5 text-xs hover:underline"
						onClick={handleMarkAll}
					>
						<Checks size={18} />
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

export default NotificationFooter;
