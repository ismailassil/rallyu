'use client';
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import { motion } from "framer-motion";

export default function Dashboard() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="bg-white/4 border border-white/10  w-full rounded-2xl backdrop-blur-2xl py-8 mb-4">
				<header className="relative shrink-0 overflow-hidden">
					<h1
					className={`${funnelDisplay.className} font-bold pb-0.5 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
					>
						Settings
					</h1>
					<div className="w-18 h-5 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
				</header>
				<p className="px-14 text-white/65 text-lg">Manage your details and personal preferences, customize your RALLYU experience</p>
				<div className="px-14 mt-8 flex gap-3">
					<button className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs`}>General</button>
					<button className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs`}>Users</button>
					<button className={`border-0 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-bold text-black
					bg-white`}>Security</button>
					<button className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs`}>Game</button>
				</div>
			</div>
			
			<div className="bg-white/4 border border-white/10 h-100 w-full rounded-2xl backdrop-blur-2xl py-8">

			</div>
		</motion.main>
	);
}
