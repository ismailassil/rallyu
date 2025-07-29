import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InnerNotification from "./Notification/InnerNotification";

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

	return (
		<div className="relative" ref={notificationRef}>
			<button
				className={`bg-card border-br-card ml-4 flex h-[55px]
							w-[55px] items-center justify-center rounded-full border-2 hover:cursor-pointer
							${
								isNotif
									? "bg-hbg border-hbbg ring-bbg 								scale-101 ring-4"
									: "hover:bg-hbg hover:border-hbbg hover:ring-bbg 								hover:scale-101 hover:ring-4"
							} transition-transform duration-200
								
								`}
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
						className="top-18 w-70 bg-card border-br-card absolute right-0
							z-10 flex 
							max-h-[348px] origin-top-right flex-col overflow-hidden rounded-lg
							border-2 backdrop-blur-xl"
					>
						<div className="bg-card/70 sticky top-0 z-20 flex w-full items-center justify-between px-4 py-3 text-start backdrop-blur-3xl">
							<p>Notification</p>
							<div
								className="bg-hbbg flex h-1 w-1 items-center justify-center rounded-full p-3
									text-center text-sm"
							>
								0
							</div>
						</div>
						<div className="custom-scroll divide-y-1 divide-bg flex-1 overflow-y-scroll">
							{Array.from({ length: 12 }).map((_, i) => (
								// <p key={i} className="px-7 py-4 w-full flex text-start h-14">
								// 	Nothing &#129488;
								// </p>
								<InnerNotification
									key={i}
									name={"Ismail Assil"}
									message={"Hello Ismail! How are you doing"}
									type={"game"}
								/>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
