import moment from "moment";
import { motion } from "framer-motion";
import { Notification } from "../types/notifications.types";
import Chat from "../items/Chat";
import FriendRequest from "../items/FriendRequest";
import GameOrTournament from "../items/GameOrTournament";
import { XIcon } from "@phosphor-icons/react";
import { useNotification } from "../context/NotificationContext";
import { useTranslations } from "next-intl";
import Avatar from "@/app/(onsite)/users/components/Avatar";

interface Props {
	data: Notification;
	handler: (id: number, status: "read" | "dismissed", state: "pending" | "finished") => void;
}

const decisionOptions = ["tournament", "game", "xo_game", "pp_game"];

function NotificationCard({ data, handler }: Props) {
	const { id, senderUsername, senderId, content, type, updatedAt, status, avatar, state } = data;
	const t = useTranslations("headers.notification.box");
	const textDescriptionRef = t(`description.${type}`);
	const dateRef = moment.utc(updatedAt).local().fromNow();
	const { handleAccept, handleDecline } = useNotification();

	return (
		<motion.li
			className="relative flex min-h-16 w-full flex-col gap-3 overflow-hidden px-2 py-4 text-start duration-300 hover:bg-black/10"
			onHoverStart={() => status === "unread" && handler(id, "read", state)}
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
					onClick={() => handler(id, "dismissed", state)}
				/>
			</div>
			{type === "chat" ? (
				<Chat
					message={content}
					username={senderUsername}
					receiverId={senderId}
					state={state === "finished" ? true : false}
					handler={() => handler(id, "read", "finished")}
				/>
			) : type === "friend_request" ? (
					<FriendRequest
						handleAccept={() => handleAccept(data, false)}
						handleDecline={() => handleDecline(data, false)}
					/>
			) : (
				decisionOptions.includes(type) && (
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
