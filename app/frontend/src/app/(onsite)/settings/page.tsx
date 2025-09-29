'use client';
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import { AnimatePresence, motion } from "framer-motion";
import General from "./components/General/GeneralSettingsTab";
import Users from './components/Users/Users';
import Security from "./components/Security/Security";
import { useState } from "react";
import { Cog, UsersIcon, Gamepad2, Fingerprint } from "lucide-react";
import { Toaster } from "sonner";
import { toastLoading } from "@/app/components/CustomToast";

type Tab = {
	label: string;
	icon: React.ReactNode;
}

const TABS = [
	{ label: 'General', icon: <Cog size={18} /> },
	{ label: 'Users', icon: <UsersIcon size={18} /> },
	{ label: 'Security', icon: <Fingerprint size={18} /> },
	// { key: 'Game', label: 'Game', icon: <Gamepad2 size={18} /> },
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
			// case 'Game': return <Game />;
			default: return null;
		}
	}

	setTimeout(() => {
		toastLoading('DEV - Page still under development.');
	}, 2000);
	
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 1, y: 50 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<Toaster position='bottom-right' visibleToasts={1} />
			<div className="bg-white/4 border border-white/10  w-full rounded-2xl backdrop-blur-2xl py-8 mb-8">
				<header className="relative shrink-0 overflow-hidden">
					<h1
					className={`${funnelDisplay.className} font-bold pb-0.5 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
					>
						Settings
					</h1>
					<div className="w-18 h-5 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
				</header>
				<p className="px-14 text-white/65 text-lg">Manage your account preferences and security settings</p>
			</div>
			
			<TabSelector activeTab={activeTab} onSelect={setActiveTab} />

			<div>
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 1 }}
						className="overflow-hidden"
					>
						{renderActiveTab()}
					</motion.div>
				</AnimatePresence>
			</div>
		</motion.main>
	);
}
