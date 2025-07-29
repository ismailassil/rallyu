import { motion } from "framer-motion";
import { ReactNode } from "react";

type SlideInOutProps = {
	children: ReactNode;
}

export default function SlideInOut({ children }: SlideInOutProps) {
	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			// className={`${className}`}
		>
			{children}
		</motion.div>
	);
}
