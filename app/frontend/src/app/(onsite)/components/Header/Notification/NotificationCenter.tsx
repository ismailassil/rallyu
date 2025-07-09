import { AnimatePresence, motion } from "framer-motion";
import NotificationButton from "./components/NotificationButton";
import { useHeaderContext } from "../context/HeaderContext";
import NotificationBox from "./components/NotificationBox";

export default function NotificationCenter() {
	const { isNotif, notificationRef } = useHeaderContext();

	return (
		<div className="relative" ref={notificationRef}>
			<NotificationButton />
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
						<NotificationBox />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
