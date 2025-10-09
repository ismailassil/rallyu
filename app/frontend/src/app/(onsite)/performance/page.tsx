'use client';
import React, { useEffect, useState } from 'react';
import { Gamepad, Swords, UserRound } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { APIError } from '@/app/(api)/APIClient';
import { toastError } from '@/app/components/CustomToast';
import { UserAnalytics, UserAnalyticsByDay } from './types';
import Overview from './components/Tabs/Overview';
import { motion, AnimatePresence } from 'framer-motion';
import Games from './components/Tabs/Games';
import Opponent from './components/Tabs/Opponent';

const TABS = [
	{ label: 'Overview', icon: <Gamepad size={18} /> },
	{ label: 'Opponent', icon: <UserRound size={18} /> },
	{ label: 'Games', icon: <Swords size={18} /> }
];

function TabSelector({ activeTab, onSelect } : { activeTab: string, onSelect: (tab: 'Overview' | 'Games' | 'Opponent') => void }) {
	return (
		<div className="flex gap-3 mb-3 w-full">
			{TABS.map(({ label, icon }) => (
				<button
					key={label}
					onClick={() => onSelect(label as 'Overview' | 'Games' | 'Opponent')}
					className={`rounded-full px-3.5 py-1.5 font-medium flex gap-2 items-center box-border justify-center
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

export default function PerformancePage() {
	const { apiClient, loggedInUser } = useAuth();
	const [activeTab, setActiveTab] = useState<'Overview' | 'Games' | 'Opponent'>('Overview');
	const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
	const [userAnalyticsByDay, setUserAnalyticsByDay] = useState<UserAnalyticsByDay[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	
	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				setIsLoading(true);
				const analytics = await apiClient.fetchUserAnalytics(loggedInUser!.id);
				const analyticsByDay = await apiClient.fetchUserAnalyticsByDay(loggedInUser!.id);
				setUserAnalytics(analytics);
				setUserAnalyticsByDay(analyticsByDay);
				setIsLoading(false);
			} catch (err) {
				const apiErr = err as APIError;
				toastError(apiErr.message);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserAnalytics();
	}, [apiClient, loggedInUser]);

	if (isLoading || !userAnalytics || !userAnalyticsByDay)
		return null;

	function renderActiveTab() {
		switch (activeTab) {
			case 'Overview': return	<Overview userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
			case 'Opponent': return	<Opponent userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
			case 'Games': return <Games userAnalytics={userAnalytics!} userAnalyticsByDay={userAnalyticsByDay!} />;
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
								Performance
							</h1>
							<div className="w-18 h-5 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-14 text-white/65 text-sm lg:text-lg">View detailed stats and historical data of your games</p>
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
