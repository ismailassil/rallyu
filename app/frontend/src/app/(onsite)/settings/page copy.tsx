'use client';
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import { motion } from "framer-motion";
import { Pencil, Upload } from "lucide-react";
import Image from "next/image";

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
			
			<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl py-8 px-12 flex justify-between items-center mb-4">
				<div className="flex items-center gap-8">
					<div className="rounded-full h-30 w-30 ring-4 ring-white/10">
						<Image
							src='/profile/image.png'
							alt="Profile Image"
							width={96}
							height={96}
							className="h-full w-full object-cover rounded-full"
							quality={100}
						/>
					</div>
					<div>
						<h1 className={`font-bold text-3xl text-white/90 mb-2 `}>Nabil Azouz</h1>
						<p className={`text-xl text-white/70 ${funnelDisplay.className}`}>@xezzuz</p>
						<p className="text-lg text-white/60">Something went wrong, please try again later</p>
					</div>
				</div>
				<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs w-22 h-10`}>
					<div className="flex items-center gap-2 justify-center">
						<Upload size={16}/>
						<button>Edit</button>
					</div>
				</div>
			</div>
			<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl py-8 px-12">
				<div className="flex justify-between items-center mb-6">
					<h1 className="font-bold text-xl">Personal Informations</h1>
					<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs w-22 h-10`}>
						<div className="flex items-center gap-2 justify-center">
							<Pencil size={16}/>
							<button>Edit</button>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-5">
					<div>
						<h1>First Name</h1>
						<p>Nabil</p>
					</div>
					<div>
						<h1>Last Name</h1>
						<p>Azouz</p>
					</div>
					<div>
						<h1>Email</h1>
						<p>nabil.azouz@gmail.com</p>
					</div>
					<div>
						<h1>Username</h1>
						<p>xezzuz</p>
					</div>
					<div>
						<h1>Bio</h1>
						<p>Something went wrong, please try again later</p>
					</div>
				</div>
			</div>
		</motion.main>
	);
}
