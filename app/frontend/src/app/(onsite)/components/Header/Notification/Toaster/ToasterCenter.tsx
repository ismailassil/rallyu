import { useNotification } from "../context/NotifContext";
import ToasterItem from "./ToasterItem";
import { AnimatePresence, motion } from "framer-motion";

const ToasterCenter = () => {
	const { toastNotifications, DEFAULT_TIME } = useNotification();

	return (
		<ul className="top-30 w-90 z-200 absolute right-6 flex flex-col gap-2">
			<AnimatePresence mode="popLayout">
				{toastNotifications.map((notif, i) => {
					return (
						<motion.li
							key={notif.id}
							layout
							initial={{ y: 10, scale: 0.6 }}
							animate={{ y: 0, scale: 1, transition: { duration: 0.2 } }}
							exit={{
								y: -5,
								opacity: 0,
								scale: 0.9,
								transition: {
									duration: 0.25,
									delay: i * 0.05,
									ease: "easeInOut",
								},
							}}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<ToasterItem
								type={notif.type}
								image={notif.image}
								username={notif.username}
								time={DEFAULT_TIME}
								action_url={notif.action_url}
							/>
						</motion.li>
					);
				})}
			</AnimatePresence>
		</ul>
	);
};

export default ToasterCenter;
