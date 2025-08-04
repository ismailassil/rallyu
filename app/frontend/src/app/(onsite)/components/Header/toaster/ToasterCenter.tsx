import { useNotification } from "../notification/context/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";
import ToasterItem from "./ToasterItem";

const ToasterCenter = () => {
	const { toastNotifications, DEFAULT_TIME } = useNotification();

	const exitVar = (i: number) => {
		return {
			y: -5,
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.25,
				delay: i * 0.05,
				ease: "easeInOut" as const,
			},
		};
	};

	return (
		<ul className="absolute top-30 right-6 z-200 flex w-90 flex-col gap-2">
			<AnimatePresence mode="popLayout">
				{toastNotifications.map((notif, i) => {
					return (
						<motion.li
							key={notif.id}
							layout
							initial={{ y: 10, scale: 0.6 }}
							animate={{ y: 0, scale: 1, transition: { duration: 0.2 } }}
							exit={exitVar(i)}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<ToasterItem
								data={notif}
								time={DEFAULT_TIME}
							/>
						</motion.li>
					);
				})}
			</AnimatePresence>
		</ul>
	);
};

export default ToasterCenter;
