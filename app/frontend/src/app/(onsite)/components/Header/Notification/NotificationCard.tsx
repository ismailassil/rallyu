import { ArrowBendUpRight, X } from "@phosphor-icons/react";
import Image from "next/image";
import moment from "moment";
import OutlineButton from "./components/OutlineButton";
import FilledButton from "./components/FilledButton";
import { motion } from "framer-motion";
import { useRef } from "react";
import { getTextDescription, InnerNotifProps } from "./types/NotificationCard.types";

// TODO: When the user hovers over the notification, MARK IT AS READ
function NotificationCard({ name, image, message, type, status, date, ...props }: InnerNotifProps) {
	const textDescriptionRef = useRef<string>(getTextDescription(type));
	const dateRef = useRef<string>(moment(date).fromNow());

	return (
		<motion.div
			className="min-h-16 relative flex w-full flex-col gap-3 overflow-hidden
				px-2 py-4 text-start duration-300 hover:bg-black/10"
			{...props}
		>
			{status === "unread" && <div className="size-2 absolute rounded-full bg-yellow-300" />}
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
						<span className="font-semibold">{name}</span> {textDescriptionRef.current}
					</p>
					<p className="text-xs text-gray-400">{dateRef.current}</p>
				</div>
			</div>

			<div className="ml-10 flex gap-2">
				{type === "chat" ? (
					<div
						className="bg-card ring-br-card hover:scale-101 flex w-full cursor-pointer
								items-center justify-between gap-2 rounded-lg px-4 py-2
								text-xs ring-1 transition-all duration-300 hover:bg-white/10"
					>
						<p className="line-clamp-2 flex-1">{message}</p>
						<ArrowBendUpRight size={18} />
					</div>
				) : type === "friend_request" ? (
					<>
						<OutlineButton>Decline</OutlineButton>
						<FilledButton>Accept</FilledButton>
					</>
				) : (
					<>
						<FilledButton>Join Game</FilledButton>
						<OutlineButton>
							<X size={16} />
						</OutlineButton>
					</>
				)}
			</div>
		</motion.div>
	);
}

export default NotificationCard;
