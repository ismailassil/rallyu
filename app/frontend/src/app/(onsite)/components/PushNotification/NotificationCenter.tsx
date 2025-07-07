import React, { useCallback, useState } from "react";
import PushNotificationItem from "./PushNotificationItem";
import { AnimatePresence, motion } from "framer-motion";
import { notificationsType, notifType } from "./types";

// TODO: Remove this
const image = "/profile/darthVader.jpeg";
const username = "iassil";

const NotificationCenter = () => {
	const [notifications, setNotifications] = useState<notificationsType[]>([]);

	const addNotif = useCallback((notifications: notificationsType[], notif: notifType) => {
		const sound = new Audio("/notification.mp3");
		sound.play();
		const timmed = notifications.length >= 4 ? notifications.slice(1) : notifications;
		return [...timmed, notif];
	}, []);

	const handleRemove = useCallback((id: string) => {
		setNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	return (
		<>
			{/* <div
				className="bg-main z-400 absolute left-1 top-1 cursor-pointer select-none rounded-full px-6 py-1"
				onClick={() => {
					setNotifications(
						addNotif(notifications, {
							id: crypto.randomUUID(),
							image,
							username,
							type: "chat",
						})
					);
				}}
			>
				ADD
			</div> */}
			<ul className="top-30 w-90 z-200 absolute right-6 flex flex-col gap-2">
				<AnimatePresence>
					{notifications.map((notif) => {
						return (
							<motion.li
								key={notif.id}
								layout
								initial={{ opacity: 1, x: 100 }}
								animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
								exit={{ opacity: 1, x: 600, transition: { duration: 0.2 } }}
								transition={{ type: "spring", duration: 0.2, stiffness: 50 }}
							>
								<PushNotificationItem
									id={notif.id}
									type={notif.type}
									onClose={() => handleRemove(notif.id)}
									image={notif.image}
									username={notif.username}
								/>
							</motion.li>
						);
					})}
				</AnimatePresence>
			</ul>
		</>
	);
};

export default NotificationCenter;
