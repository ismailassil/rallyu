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
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<article
				className="bg-card border-br-card flex h-full w-full flex-col gap-5
						rounded-2xl border-2 p-4 pl-3 md:gap-0"
			>
				<ProfileHeader fullname="Ismail Assil" img="/image.png" />
				<SettingsContent />
			</article>
		</motion.main>
	);
}
