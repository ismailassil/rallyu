'use client';
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import { AnimatePresence, motion } from "framer-motion";
import General from "./components/Tabs/General/GeneralSettingsTab";
import Users from './components/Tabs/Users/UsersSettingsTab';
import Security from "./components/Tabs/Security/SecuritySettingsTab";
import { useState } from "react";
import { Cog, UsersIcon, Fingerprint } from "lucide-react";

const TABS = [
	{ label: 'General', icon: <Cog size={18} /> },
	{ label: 'Users', icon: <UsersIcon size={18} /> },
	{ label: 'Security', icon: <Fingerprint size={18} /> }
];

function TabSelector({ activeTab, onSelect } : { activeTab: string, onSelect: (tab: string) => void }) {
	return (
		<div className="flex gap-3 mb-3 w-full">
			{TABS.map(({ label, icon }) => (
				<button
					key={label}
					onClick={() => onSelect(label)}
					className={`rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium flex gap-2 items-center box-border justify-center
					${activeTab === label
						? 'border-1 font-bold text-black bg-white flex-2'
						: 'border-1 border-white/10 hover:bg-white/10 flex-1'
					} cursor-pointer transition-all duration-600`}
				>
					{icon}
					{label}
				</button>
			))}
		</div>
	);
}

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState('General');

	function renderActiveTab() {
		switch (activeTab) {
			case 'General': return <General />;
			case 'Users': return <Users />;
			case 'Security': return <Security />;
			default: return null;
		}
	}
	
	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="pt-30 sm:pl-30 h-screen w-screen pb-24 pl-6 pr-6 sm:pb-6 overflow-hidden font-funnel-display"
		>
			<div className="sm:h-[calc(100vh-9rem)] h-[calc(100vh-14rem)] overflow-hidden">
				{/* HEADER + TABS */}
				<div>
					<div className="bg-white/4 border border-white/10 w-full rounded-2xl py-4 sm:py-8 mb-8">
						<header className="relative shrink-0 overflow-hidden">
							<h1
								className='font-bold pb-0.5 px-13 select-none text-2xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'
							>
								Settings
							</h1>
							<div className="w-18 h-5 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-14 text-white/65 text-sm lg:text-lg">Manage your account preferences and security settings</p>
					</div>
					
					<TabSelector activeTab={activeTab} onSelect={setActiveTab} />
				</div>

				{/* PAGE MAIN CONTENT */}
				<div className="h-[calc(100vh-26rem)] sm:h-[calc(100vh-22.7rem)] overflow-y-auto hide-scrollbar rounded-2xl">
					<AnimatePresence>
							{renderActiveTab()}
					</AnimatePresence>
				</div>
			</div>
		</motion.main>
	);
}
