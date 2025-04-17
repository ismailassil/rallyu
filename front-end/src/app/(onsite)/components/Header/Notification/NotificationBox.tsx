import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";

type Notification = {
	id: string;
	sender: { img: string; name: string };
	message: string | null;
	type: "msg" | "pingpong" | "xo";
	uri: string;
};

function NotificationBox() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	function addNotification(newNotif: Notification) {
		setNotifications([newNotif]);
	}
	useEffect(() => {
		const testNotifications: Array<Omit<Notification, "id">> = [
			{
				sender: { img: "/image_1.jpg", name: "Nabil Azouz" },
				message: "Hello! How are you?",
				type: "msg",
				uri: "",
			},
			{
				sender: { img: "/image_2.jpg", name: "Salah Demnati" },
				message: "",
				type: "pingpong",
				uri: "",
			},
			{
				sender: { img: "/image_1.jpg", name: "Mohamed Amine Maila" },
				message: "Wa fen a sat! hani howa hadak, dar bikhir, l2a7wal houma hadouk?",
				type: "xo",
				uri: "",
			},
		];

		const interval = setInterval(() => {
			const randomNotif = testNotifications[Math.floor(Math.random() * testNotifications.length)];
			addNotification({
				id: Date.now().toString(),
				message: randomNotif.message,
				type: randomNotif.type,
				sender: randomNotif.sender,
				uri: randomNotif.uri,
			});
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (notifications.length === 0) return;
		const timer = setTimeout(() => {
			setNotifications((prev) => prev.slice(1));
		}, 10000);

		return () => clearTimeout(timer);
	}, [notifications]);

	return (
		<div className="z-203 fixed left-1/2 top-0 -translate-x-1/2">
			{notifications.map((notif) => (
				<NotificationItem
					key={notif.id}
					type={notif.type}
					sender={notif.sender}
					message={notif.message}
					uri={notif.uri}
				/>
			))}
		</div>
	);
}

export default NotificationBox;
