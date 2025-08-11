import { AnimatePresence, motion } from "framer-motion";
import NotificationButton from "./ToggleButton";
import { useHeaderContext } from "../../context/HeaderContext";
import NotificationList from "./NotificationList";
import Header from "./Header";
import Footer from "./Footer";

export default function NotificationCenter() {
	const { isNotif, notificationRef } = useHeaderContext();

	const fadeInOut = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: {
			type: "spring" as const,
			stiffness: 60,
			duration: 0.1,
		},
	};

	return (
		<div className="relative" ref={notificationRef}>
			<NotificationButton />
			<AnimatePresence>
				{isNotif && (
					<motion.div
						{...fadeInOut}
						className="bg-card border-br-card absolute top-18 right-0 z-10 flex max-h-130 w-80 origin-top-right flex-col overflow-hidden rounded-lg border-2 backdrop-blur-3xl"
					>
						<Header />
						<NotificationList />
						<Footer />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
