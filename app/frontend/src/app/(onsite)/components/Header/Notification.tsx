import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InnerNotification from "./Notification/InnerNotification";
import { Check } from "@phosphor-icons/react";

interface NotificationProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isNotif: boolean;
	notificationRef: React.Ref<HTMLDivElement>;
}

export default function Notification({
	setIsNotif,
	setIsProfile,
	setIsSearch,
	isNotif,
	notificationRef,
}: NotificationProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [newNotification, setNewNotification] = useState<boolean>(false);
	const notificationCount = 1;

	const notifSubTitle =
		notificationCount >= 1
			? `You have ${notificationCount} unread notification${notificationCount > 1 ? "s" : ""}`
			: `You have no new notifications`;

	return (
		<div className="relative" ref={notificationRef}>
			<button
				className={`bg-card border-br-card ml-4 flex h-[55px]
							w-[55px] items-center justify-center rounded-full border-2 hover:cursor-pointer
							${
								isNotif
									? "bg-hbg border-hbbg ring-bbg scale-101 ring-4"
									: "hover:bg-hbg hover:border-hbbg hover:ring-bbg hover:scale-101 hover:ring-4"
							} transition-transform duration-200`}
				onClick={() => {
					setIsProfile(false);
					setIsSearch(false);
					setIsNotif(!isNotif);
				}}
			>
				<Image
					src="/icons/notification.svg"
					alt="Notification Icon"
					width={0}
					height={0}
					style={{ width: "auto", height: "auto" }}
					className={`${isNotif && "animate-pulse"}`}
				/>
			</button>
			{newNotification && (
				<div className="absolute right-4 top-4 h-2 w-2 animate-ping rounded-full bg-red-500 ring-1 ring-red-400"></div>
			)}
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
						className="top-18 w-75 bg-card border-br-card max-h-130 absolute
							right-0 z-10 
							flex origin-top-right flex-col overflow-hidden rounded-lg
							border-2 backdrop-blur-3xl"
					>
						<div className="bg-card  sticky top-0 z-20 flex w-full flex-col px-4 py-3 text-start backdrop-blur-3xl">
							<p className="font-bold">Notification</p>
							<p className="text-gray text-sm text-gray-400">{notifSubTitle}</p>
						</div>
						<div className="custom-scroll divide-y-1 divide-bg flex-1 overflow-y-scroll">
							{/* <p className="flex h-14 w-full px-7 py-4 text-start">Nothing &#129488;</p> */}
							{Array.from({ length: 12 }).map((_, i) => (
								<>
									<InnerNotification
										key={i}
										name={"iassil_trucker"}
										message={"Hello Ismail! How are you doing?"}
										type={"chat"}
										date={Date.now()}
									/>
									<InnerNotification
										key={i * 100}
										name={"iassil"}
										message={"Hello Ismail! How are you doing?"}
										type={"game"}
										date={Date.now()}
									/>
								</>
							))}
						</div>
						<div className="bg-card top-0 z-20 flex w-full justify-between px-4 py-3 text-start backdrop-blur-3xl">
							<p className="flex cursor-pointer items-end gap-2 text-xs hover:underline">
								<Check size={18} />
								Mark all as read
							</p>
							<p className="flex cursor-pointer items-end gap-2 text-xs hover:underline">
								Clear All
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
