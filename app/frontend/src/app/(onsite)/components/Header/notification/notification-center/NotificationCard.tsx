import Image from "next/image";
import moment from "moment";
import { motion } from "framer-motion";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { NOTIFICATION_TYPE, USER_NOTIFICATION } from "../types/notifications.types";
import Chat from "../items/Chat";
import FriendRequest from "../items/FriendRequest";
import GameOrTournament from "../items/GameOrTournament";
import { XIcon } from "@phosphor-icons/react";

function NotificationCard({ data }: { data: USER_NOTIFICATION }) {
	const { id, senderUsername, content, type, updatedAt, status, actionUrl, avatar } = data;
	const textDescriptionRef = getTextDescription(type);
	const dateRef = moment.utc(updatedAt).local().fromNow();
	const isValid = moment().diff(moment.utc(updatedAt).local(), "minutes") >= 3;
	const { api } = useAuth();

	function handleOnHover() {
		if (status !== "unread") return;

		console.log("Notif ID: " + id);
		api.instance
			.put("/notif/update", {
				notificationId: id,
				status: "read",
				scope: "single",
			})
			.then((value) => {
				console.log(value);
			})
			.catch((err) => {
				console.log(err);
			});

		/**
		 * TODO: After a friend_request is accepted or declined,
		 * 		send the response to User Management MS and dismissed it in DB (NOTIF_MS)
		 */
	}

	function handleDismiss() {
		api.instance
			.put("/notif/update", {
				notificationId: id,
				status: "dismissed",
				scope: "single",
			})
			.then((value) => {
				console.log("Update Notification: " + value);
			})
			.catch((err) => {
				console.error("Update Notification: " + err);
			});
	}

	return (
		<motion.li
			className="relative flex min-h-16 w-full flex-col gap-3 overflow-hidden px-2 py-4 text-start duration-300 hover:bg-black/10"
			onHoverStart={handleOnHover}
		>
			{status === "unread" && (
				<div className="absolute top-5 left-9 size-2 -translate-1/2 rounded-full bg-yellow-400" />
			)}
			<div className="flex flex-1 justify-between select-none">
				<div className="flex w-full gap-3">
					<div
						className={`flex aspect-square max-h-8 min-h-8 max-w-8 min-w-8 overflow-hidden rounded-full ring-yellow-400 ${status === "unread" && "ring-1"}`}
					>
						<Image
							src={"http://localhost:4025/api/users/avatars/" + avatar}
							alt="Profile Image"
							width={40}
							height={40}
							className="object-cover"
						/>
					</div>
					<div>
						<p className="text-sm font-light">
							<span className="font-semibold">{senderUsername}</span>{" "}
							{textDescriptionRef}
						</p>
						<p className="text-xs text-gray-400">{dateRef}</p>
					</div>
				</div>
				<XIcon
					size={22}
					className="relative cursor-pointer rounded-full p-0.5"
					onClick={handleDismiss}
				/>
			</div>

			{type === "chat" ? (
				<Chat message={content} username={senderUsername} />
			) : type === "friend_request" ? (
				<FriendRequest actionUrl={actionUrl || ""} />
			) : (
				<GameOrTournament isValid={isValid} type={type} />
			)}
		</motion.li>
	);
}

export default NotificationCard;

export const getTextDescription = (type: NOTIFICATION_TYPE) => {
	switch (type) {
		case "game":
			return "challenged you to a game!";
		case "friend_request":
			return "sent you a friend request!";
		case "chat":
			return "sent you a message.";
		case "tournament":
			return "invited you to start a tournament!";
	}
};
