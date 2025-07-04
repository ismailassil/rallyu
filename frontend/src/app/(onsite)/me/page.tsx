/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import FriendsPanel from "../components/Main/FriendsPanel";
import Performance from "./components/Performance";
import GamesHistory from "./components/GamesHistory";
import UserPanel from "./components/UserPanel";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/*
	-- USER INFO
		- FIRST NAME
		- LAST NAME
		- AVATAR
	-- USER STATS
		- LEVEL
		- RANK
		- WIN RATE
		- CURRENT STREAK
	-- PERFORMANCE
		- TOTAL XP
		- TOTAL GAMES
		- LONGEST STREAK
		- PING PONG GAMES
		- TICTACTOE GAMES
		- TOTAL WINS, LOSSES, DRAWS
		- PINGPONG/TICTACTOE WINS, LOSSES DRAWS
		- PLAYTIME
	-- GAMES HISTORY
		- PLAYERS (USERNAMES, AVATARS)
		- SCORES
		- GAME TYPE
		- XP GAIN
*/

type UserInfo = {
	full_name: string,
	bio: string,
	avatar: string,
	level: number
};

type UserPerformance = {
	xp: number,
	rank: number,
	win_rate: number,
	current_streak: string,
	longest_streak: number,
	games : {
		games: number,
		wins: number,
		losses: number,
		draws: number,
		ping_pong: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		},
		tic_tac_toe: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		}
	}
};

type GameHistory = {
	game_type: string,
	player_home: {
		username: string,
		avatar: string,
		score: string
	},
	player_away: {
		username: string,
		avatar: string,
		score: string
	}
}

type UserGamesHistory = {
	games: GameHistory[];
};


export default function Me() {
	const { user, api } = useAuth();
	const [stats, setStats] = useState(null);
	
	
	useEffect(() => {
		console.log('useEffect in /me');

		async function fetchUserPage() {
			const profile = await api.getUserProfile(user!.username);
			const performance = await api.getUserPerformance(user!.username);
			const games = await api.getUserGamesHistory(user!.username);

			console.log('Profile: ', profile);
			console.log('Performance: ', performance);
			console.log('Games: ', games);
		}

		fetchUserPage();
	}, []);

	if (!stats) {
		return null;
	}

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<UserPanel user={user} stats={stats} />
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						<Performance />
						<GamesHistory />
					</div>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
