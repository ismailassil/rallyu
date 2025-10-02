import Image from "next/image";
import moment from "moment";
import { motion } from "framer-motion";
import { USER_NOTIFICATION } from "../types/notifications.types";
import Chat from "../items/Chat";
import FriendRequest from "../items/FriendRequest";
import GameOrTournament from "../items/GameOrTournament";
import { XIcon } from "@phosphor-icons/react";
import { useNotification } from "../context/NotificationContext";
import { useTranslations } from "next-intl";
import Avatar from "@/app/(onsite)/(profile)/users/components/Avatar";

interface Props {
	data: USER_NOTIFICATION;
	handler: (id: number, status: "read" | "dismissed") => void;
	handleChatUpdate: (id: number) => void;
}

function NotificationCard({ data, handler, handleChatUpdate }: Props) {
	const { id, senderUsername, senderId, content, type, updatedAt, status, avatar, state } = data;
	const t = useTranslations("headers.notification.box");
	const textDescriptionRef = t('description.' + type);
	const dateRef = moment.utc(updatedAt).local().fromNow();
	const { handleAccept, handleDecline } = useNotification();

	return (
		<motion.li
			className="relative flex min-h-16 w-full flex-col gap-3 overflow-hidden px-2 py-4 text-start duration-300 hover:bg-black/10"
			onHoverStart={() => status === "unread" && handler(id, "read")}
		>
			{status === "unread" && (
				<div className="absolute top-5 left-9 size-2 -translate-1/2 rounded-full bg-yellow-400" />
			)}
			<div className="flex flex-1 justify-between select-none">
				<div className="flex w-full gap-3">
					<Avatar
						avatar={avatar}
						className={`flex aspect-square max-h-8 min-h-8 max-w-8 min-w-8 overflow-hidden rounded-full ring-yellow-400 ${status === "unread" && "ring-1"}`}
					/>
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
					onClick={() => handler(id, "dismissed")}
				/>
			</div>
			{type === "status" ? null : type === "chat" ? (
				<Chat
					message={content}
					username={senderUsername}
					receiverId={senderId}
					state={state === "finished" ? true : false}
					handler={() => handleChatUpdate(id)}
				/>
			) : type === "friend_request" ? (
				state === "pending" && (
					<FriendRequest
						handleAccept={() => handleAccept(data, false)}
						handleDecline={() => handleDecline(data, false)}
					/>
				)
			) : (
				state === "pending" && (
					<GameOrTournament
						type={type}
						handleAccept={() => handleAccept(data, false)}
						handleDecline={() => handleDecline(data, false)}
					/>
				)
			)}
		</motion.li>
	);
}

export default NotificationCard;
