"use client";

import { motion } from "framer-motion";
import ProfileHeader from "./components/ProfileHeader";
import SettingsContent from "./components/SettingsContent";

export default function Dashboard() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-[100vh] pt-30 pl-6 sm:pl-30 pr-6 pb-24 sm:pb-6"
		>
			<article
				className="h-full w-full flex flex-col bg-card rounded-2xl border-2
						border-br-card p-4 pl-3 gap-5 md:gap-0" 
			>
				<ProfileHeader fullname="Ismail Assil" img="/image.png" />
				<SettingsContent />
			</article>
		</motion.main>
	);
}
