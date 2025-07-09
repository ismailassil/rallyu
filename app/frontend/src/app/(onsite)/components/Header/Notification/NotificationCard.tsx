import Image from "next/image";
import moment from "moment";
import { motion } from "framer-motion";
import { getTextDescription, InnerNotifProps } from "./types/NotificationCard.types";
import ChatNotification from "./components/ChatNotification";
import FriendRequestNotification from "./components/FriendRequestNotification";
import GameNotification from "./components/GameNotification";
// import axios from "axios";

function NotificationCard({ id, name, image, message, type, status, date, ...props }: InnerNotifProps) {
	const textDescriptionRef = getTextDescription(type);
	const dateRef = moment.utc(date).local().fromNow();
	const isValid = moment().diff(moment.utc(date).local(), "minutes") >= 3;

	function handleOnHover() {
		if (status !== "unread") return;

		console.log("Notif ID: " + id);
		// TODO: Uncomment this
		// axios
		// 	.put("http://localhost:4004/api/notif/update", {
		// 		username: "iassil",
		// 		notificationId: id,
		// 		status: "read",
		// 	})
		// 	.then((value) => {
		// 		console.log(value);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}

	return (
		<motion.li
			className="min-h-16 relative flex w-full flex-col gap-3 overflow-hidden
				px-2 py-4 text-start duration-300 hover:bg-black/10"
			{...props}
			onHoverStart={handleOnHover}
		>
			{status === "unread" && (
				<div className="absolute -right-0.5 top-1/2 h-[80%] w-1 -translate-y-1/2 rounded-full bg-white/30" />
			)}
			<div className="flex flex-1 select-none items-center gap-3">
				<div
					className="min-h-8 min-w-8 max-w-8 flex aspect-square max-h-8
						overflow-hidden rounded-full"
				>
					<Image
						src={image}
						alt="Profile Image"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>
				<div>
					<p className="text-sm font-light">
						<span className="font-semibold">{name}</span> {textDescriptionRef}
					</p>
					<p className="text-xs text-gray-400">{dateRef}</p>
				</div>
			</div>

			
				{type === "chat" ? (
					<ChatNotification message={message} />
				) : type === "friend_request" ? (
					<FriendRequestNotification />
				) : (
					<GameNotification isValid={isValid} />
				)}
		</motion.li>
	);
}

export default NotificationCard;
