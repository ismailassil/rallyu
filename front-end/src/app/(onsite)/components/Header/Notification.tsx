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
				className={`ml-4 rounded-full bg-card border-2 hover:cursor-pointer
							border-br-card w-[55px] h-[55px] flex justify-center items-center
							${
								isNotif
									? "bg-hbg border-hbbg ring-4 \
								ring-bbg scale-101"
									: "hover:bg-hbg hover:border-hbbg hover:ring-4 \
								hover:ring-bbg hover:scale-101"
							} transition-transform duration-200
								
								`}
				onClick={() => {
					setIsProfile(false);
					setIsSearch(false);
					setIsNotif(!isNotif);
				}}
			>
				<Image
					src="/notification.svg"
					alt="Notification Icon"
					width={0}
					height={0}
					style={{ width: "auto", height: "auto" }}
					className={`${isNotif && "animate-pulse"}`}
				/>
			</button>
			{newNotification && (
				<div className="absolute right-4 top-4 h-2 w-2 bg-red-500 rounded-full animate-ping ring-1 ring-red-400"></div>
			)}
			<AnimatePresence>
				{isNotif && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "spring", stiffness: 60, duration: 0.1 }}
						className="absolute flex flex-col right-0 z-10 max-h-[348px]
							top-18 w-70 
							origin-top-right rounded-lg bg-card border-2 border-br-card
							backdrop-blur-xl overflow-hidden"
					>
						<div className="px-4 py-3 w-full flex sticky top-0 z-20 bg-card/70 backdrop-blur-3xl text-start justify-between items-center">
							<p>Notification</p>
							<div
								className="w-1 h-1 p-3 text-center flex items-center justify-center text-sm
									rounded-full bg-hbbg"
							>
								0
							</div>
						</div>
						<div className="flex-1 overflow-y-scroll custom-scroll divide-y-1 divide-bg">
							{Array.from({ length: 12 }).map((_, i) => (
								// <p key={i} className="px-7 py-4 w-full flex text-start h-14">
								// 	Nothing &#129488;
								// </p>
								<InnerNotification key={i} name={"Ismail Assil"} message={"Hello Ismail! How are you doing"} type={"game"} />
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
