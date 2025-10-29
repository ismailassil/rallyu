'use client';
import React, { useState } from 'react';
import { Gamepad, Swords, UserRound } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Overview from './components/Tabs/Overview';
import { motion, AnimatePresence } from 'framer-motion';
import Games from './components/Tabs/Games';
import Opponent from './components/Tabs/Opponent';
import { useTranslations } from 'next-intl';
import useAPIQuery from '@/app/hooks/useAPIQuery';

const TABS = [
	{ label: 'overview', icon: <Gamepad size={18} /> },
	{ label: 'opponent', icon: <UserRound size={18} /> },
	{ label: 'games', icon: <Swords size={18} /> }
];

function TabSelector({ activeTab, onSelect } : { activeTab: string, onSelect: (tab: 'overview' | 'games' | 'opponent') => void }) {
	const t = useTranslations('performance_dashboard');
	return (
		<div className="flex gap-3 mb-3 w-full">
			{TABS.map(({ label, icon }) => (
				<button
					key={label}
					onClick={() => onSelect(label as 'overview' | 'games' | 'opponent')}
					className={`rounded-full px-3.5 py-1.5 font-medium flex gap-2 items-center box-border justify-center
					${activeTab === label
						? 'border-1 font-bold text-black bg-white flex-2'
						: 'border-1 border-white/10 hover:bg-white/10 flex-1'
					} cursor-pointer transition-all duration-600`}
				>
					{icon}
					{label === 'overview' && t('overview.title')}
					{label === 'opponent' && t('opponent.title')}
					{label === 'games' && t('games.title')}
				</button>
			))}
		</div>
	);
}

export default function PerformancePage() {
	const { apiClient, loggedInUser } = useAuth();
	const t = useTranslations('performance_dashboard');
	const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'opponent'>('overview');

	const {
		isLoading: isLoadingA,
		data: userAnalytics,
	} = useAPIQuery(() => apiClient.user.fetchUserAnalytics(loggedInUser!.id));
	const {
		isLoading: isLoadingB,
		data: userAnalyticsByDay,
	} = useAPIQuery(() => apiClient.user.fetchUserAnalyticsByDay(loggedInUser!.id));

	if ((isLoadingA || isLoadingB) || !userAnalytics || !userAnalyticsByDay)
		return null;

	function renderActiveTab() {
		switch (activeTab) {
			case 'overview': return	<Overview userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
			case 'opponent': return	<Opponent userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
			case 'games': return <Games userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
			default: return null;
		}
	}

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="pt-30 sm:pl-30 h-screen pb-24 pl-6 pr-6 sm:pb-6 overflow-hidden font-funnel-display"
		>
			<div className="sm:h-[calc(100vh-9rem)] h-[calc(100vh-14rem)] overflow-hidden">
				{/* HEADER + TABS */}
				<div>
					<div className="bg-white/4 border border-white/10 w-full rounded-2xl py-4 sm:py-8 mb-8">
						<header className="relative shrink-0 overflow-hidden">
							<h1
								className='font-bold pb-0.5 px-13 select-none text-2xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'
							>
								{t('title')}
							</h1>
							<div className="w-18 h-5 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-14 text-white/65 text-sm lg:text-lg">{t('subtitle')}</p>
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
