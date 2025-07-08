import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InnerNotification from "./NotificationCard";
import { Bell, BellSimpleSlash } from "@phosphor-icons/react";
import NotificationHeader from "./components/NotificationHeader";
import NotificationFooter from "./components/NotificationFooter";
import { useNotification } from "./provider/NotifContext";

interface NotificationProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isNotif: boolean;
	notificationRef: React.Ref<HTMLDivElement>;
}

export default function NotificationCenter({
	setIsNotif,
	setIsProfile,
	setIsSearch,
	isNotif,
	notificationRef,
}: NotificationProps) {
	const { notifications } = useNotification();

	const handleNotifButton = () => {
		setIsProfile(false);
		setIsSearch(false);
		setIsNotif(!isNotif);
	};

	return (
		<div className="relative" ref={notificationRef}>
			<AnimatePresence>
				{isNotif && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							type: "spring",
							stiffness: 60,
							duration: 0.1,
						}}
						className="top-18 bg-card border-br-card max-h-130 absolute right-0
							z-10 flex 
							w-80 origin-top-right flex-col overflow-hidden rounded-lg
							border-2 backdrop-blur-3xl"
					>
						<NotificationHeader length={notifications.length} />
						<div className="hide-scrollbar divide-y-1 divide-bg flex-1 overflow-y-scroll">
							{notifications.length >= 1 ? (
								<AnimatePresence>
									{notifications.map((notif, i) => (
										<InnerNotification
											key={i}
											name={notif.name}
											image={notif.image}
											message={notif.message}
											type={notif.type as "chat" | "game" | "friend_request"}
											status={notif.status as "read" | "unread"}
											date={notif.date}
											exit={{
												opacity: 0.5,
												x: 400,
												transition: { delay: i * 0.1, duration: 0.2 },
											}}
										/>
									))}
								</AnimatePresence>
							) : (
								<div className="flex flex-col items-center gap-3 py-20">
									<BellSimpleSlash size={52} />
									<span className="text-sm">No Current Notifications</span>
								</div>
							)}
						</div>
						<NotificationFooter />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
