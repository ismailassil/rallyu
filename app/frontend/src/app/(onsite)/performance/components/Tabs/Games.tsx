/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { UserAnalytics, UserAnalyticsByDay } from '../../types';
import MainCardWrapper from '@/app/(onsite)/components/UI/MainCardWrapper';
import { motion } from 'framer-motion';
import TimeAnalysis from './TimeAnalysis';
import { useTranslations } from 'next-intl';

interface UserMatch {
    match_id: number;
    game_type: string;
    started_at: number;
    finished_at: number;
    user_id: number;
    user_username: string;
    user_avatar_url: string;
    user_score: number;
    opp_score: number;
    opponent_id: number;
    opponent_username: string;
    opponent_avatar_url: string;
    duration: number;
    outcome: "W" | "L" | "D";
	mode?: string;
}

function GamesHistoryTable() {
	const t = useTranslations('performance_dashboard.games.cards.games_history');
	const { loggedInUser, apiClient } = useAuth();
	const [userMatches, setUserMatches] = useState<UserMatch[]>([]);
	const [gameTypeFilter, setGameTypeFilter] = useState<'PONG' | 'XO' | 'all'>('all');
	const [timeFilter, setTimeFilter] = useState<'0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all'>('all');
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState({ currentPage: 0, totalPages: 0, hasPrev: false, hasNext: false });
	const limit = 5;

	useEffect(() => {
		async function fetchUserMatchesPage() {
			try {
				const res = await apiClient.fetchUserMatchesPage(loggedInUser!.id, {
					page,
					limit,
					gameType: gameTypeFilter,
					time: timeFilter
				});

				setUserMatches(res.matches);

				setPagination({
					currentPage: res.pagination.page,
					totalPages: res.pagination.totalPages,
					hasPrev: res.pagination.page > 1,
					hasNext: res.pagination.page < res.pagination.totalPages,
				});
			} catch (err) {
				console.error("Error fetching matches:", err);
			}
		};

		fetchUserMatchesPage();
	}, [gameTypeFilter, timeFilter, page, apiClient, loggedInUser]);

	return (
		<MainCardWrapper className='font-funnel-display pb-4 sm:pb-8'>
			<header className="relative overflow-x-hidden">
				<h1 className='font-bold py-10 px-13 select-none text-3xl lg:text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500'>
					{t('title')}
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			{/* FILTERS */}
			<div className="flex flex-wrap gap-2">
				<select
					value={gameTypeFilter}
					onChange={(e) => { setGameTypeFilter(e.target.value as any); setPage(1); }}
					className="rounded px-2 py-1"
				>
					<option value="all">{t('selectors.alltypes')}</option>
					<option value="PONG">{t('selectors.pong')}</option>
					<option value="XO">{t('selectors.xo')}</option>
				</select>
				<select
					value={timeFilter}
					onChange={(e) => { setTimeFilter(e.target.value as any); setPage(1); }}
					className="rounded px-2 py-1"
				>
					<option value="all">{t('selectors.alltime')}</option>
					<option value="1d">{t('selectors.1d')}</option>
					<option value="7d">{t('selectors.7d')}</option>
					<option value="30d">{t('selectors.30d')}</option>
					<option value="90d">{t('selectors.90d')}</option>
					<option value="1y">{t('selectors.year')}</option>
				</select>
			</div>

			{userMatches.length === 0 ? (
				<div className='h-80 flex items-center justify-center'>
					<p className='text-gray-300' >No games available. Go play some.</p>
				</div>
			) : (
				<>
				{/* TABLE FOR MEDIUM+ SCREENS */}
				<div className="hidden md:block overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
							{[t('columns.opp'), t('columns.type'), t('columns.mode'), t('columns.result'), t('columns.score'), t('columns.duration'), t('columns.date')].map((col) => (
								<th
									key={col}
									className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
								>
									{col}
								</th>
							))}
							</tr>
						</thead>
						<tbody className="divide-y">
							{userMatches.map((match) => (
								<tr key={match.match_id} className="hover:bg-white/6">
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{match.opponent_username}</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{match.game_type}</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{match.mode || t('common.ranked1v1')}</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
										<span className={`px-3 py-1 rounded-full border ${
											match.outcome === "W" ? "border-green-500 text-green-500"
											: match.outcome === "L" ? "border-red-500 text-red-500"
											: "border-gray-500 text-gray-500"}`}
										>
											{match.outcome === "W" ? t('common.win') : match.outcome === "L" ? t('common.loss') : t('common.draw')}
										</span>
									</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{match.user_score}-{match.opp_score}</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{Math.floor(match.duration / 60)}m {match.duration % 60}s</td>
									<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">{new Date(match.started_at * 1000).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* CARDS FOR SMALL SCREENS */}
				<div className="md:hidden px-4">
					{userMatches.map((match) => (
						<div key={match.match_id} className="bg-white/3 border border-white/8 px-6 py-4 rounded-2xl mb-5">
							<p className="font-bold mb-1">{match.opponent_username}</p>
							<p className="text-sm mb-1">{match.game_type} | {match.mode || t('common.ranked1v1')}</p>
							<p className="text-sm mb-1">
								<span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full border ${
									match.outcome === "W" ? "border-green-500 text-green-500"
									: match.outcome === "L" ? "border-red-500 text-red-500"
									: "border-gray-500 text-gray-500"
								}`}>
									{match.outcome === "W" ? t('common.win') : match.outcome === "L" ? t('common.loss') : t('common.draw')}
								</span>
							</p>
							<p className="text-sm mb-1">Score: {match.user_score}-{match.opp_score}</p>
							<p className="text-sm mb-1">Duration: {Math.floor(match.duration / 60)}m {match.duration % 60}s</p>
							<p className="text-sm">Date: {new Date(match.started_at).toString()}</p>
						</div>
					))}
				</div>

				{/* PAGINATION CONTROLS */}
				<div className="flex justify-end gap-2 px-4 py-3 flex-wrap">
					<button
						onClick={() => setPage(pagination.currentPage - 1)}
						disabled={!pagination.hasPrev}
						className="px-3 py-1 border rounded disabled:opacity-50"
					>
						{t('pagination.prev')}
					</button>
					<span className="px-2 py-1">{t('pagination.page')} {pagination.currentPage || page}</span>
					<button
						onClick={() => setPage(pagination.currentPage + 1)}
						disabled={!pagination.hasNext}
						className="px-3 py-1 border rounded disabled:opacity-50"
					>
						{t('pagination.next')}
					</button>
				</div>
				</>
			)}

		</MainCardWrapper>
	);
}

export default function Games({ userAnalytics, userAnalyticsByDay } : { userAnalytics: UserAnalytics, userAnalyticsByDay: UserAnalyticsByDay[] }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			<GamesHistoryTable />
			<TimeAnalysis
				userAnalytics={userAnalytics}
				userAnalyticsByDay={userAnalyticsByDay}
			/>
		</motion.div>
	);
}
