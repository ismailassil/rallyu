import funnelDisplay from '@/app/fonts/FunnelDisplay';
import unicaOne from '@/app/fonts/unicaOne';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '../../contexts/AuthContext';
import Chart from '../../(profile)/users/components/Chart';

const PREFIX = {
	total_xp: "Total XP",
	win_rate: "Win Rate",
	current_streak: "Current Streak",
	longest_streak: "Longest Streak",

	matches: "Games Played",
	wins: "Games Won",
	losses: "Games Lost",
	draws: "Games Drawn",
	
	total_user_score: "Total Score",
	max_user_score: "Highest Score",
	min_user_score: "Lowest Score",
	avg_user_score: "Average Score",
	
	total_duration: "Total Playtime",
	max_duration: "Longest Game",
	min_duration: "Shortest Game",
	avg_duration: "Average Game"
};

const SUFFIX = {
	total_xp: "XP",
	win_rate: "%",
	current_streak: "",
	longest_streak: "",

	matches: "",
	wins: "",
	losses: "",
	draws: "",
	
	total_user_score: "",
	max_user_score: "",
	min_user_score: "",
	avg_user_score: "",
	
	total_duration: "h",
	max_duration: "h",
	min_duration: "h",
	avg_duration: "h"
};

const DECIMALS = {
	total_xp: 0,
	win_rate: 2,
	current_streak: 0,
	longest_streak: 0,

	matches: 0,
	wins: 0,
	losses: 0,
	draws: 0,
	
	total_user_score: 0,
	max_user_score: 0,
	min_user_score: 0,
	avg_user_score: 1,
	
	total_duration: 1,
	max_duration: 0,
	min_duration: 0,
	avg_duration: 1
};

const mockprops = {
	records: {
		total_xp: 4564,
		win_rate: 66.64,
		current_streak: 6,
		longest_streak: 8,
	},
	totals: {
		matches: 12,
		wins: 8,
		losses: 4,
		draws: 0
		},
		scores: {
		total_user_score: 166,
		max_user_score: 21,
		min_user_score: 2,
		avg_user_score: 13.83,
		},
		durations: {
		total_duration: 10980,
		max_duration: 3000,
		min_duration: 120,
		avg_duration: 25.22
		}
};

interface ProfileSnapshotProps {
	records: {
		total_xp: number;
		win_rate: number;
		current_streak: number;
		longest_streak: number;
	};
	totals: {
		matches: number;
		wins: number;
		losses: number;
		draws: number;
	};
	scores: {
		total_user_score: number;
		max_user_score: number;
		min_user_score: number;
		avg_user_score: number;
	};
	durations: {
		total_duration: number;
		max_duration: number;
		min_duration: number;
		avg_duration: number;
	};
}

function flattenObject(obj: any) {
	const res = [];

	for (const key in obj) {
		res.push({ prefix: PREFIX[key], value: obj[key], decimals: DECIMALS[key], suffix: SUFFIX[key] });
	}

	console.log(res);

	return res;
}

type GameProps = {
	match_id: number,
    game_type: string,
    started_at: string,
    finished_at: string,
    user_id: number,
    user_username: string,
	user_avatar_path: string,
    user_score: number,
    opp_score: number,
    opponent_id: number,
    opponent_username: string,
	opponent_avatar_path: string,
    duration: number,
    outcome: string
}

function Game({ 
	match_id, 
	game_type, 
	started_at, 
	finished_at, 
	user_id, 
	user_username, 
	user_avatar_path,
	user_score, 
	opp_score, 
	opponent_id, 
	opponent_username, 
	opponent_avatar_path,
	duration, 
	outcome 
} : GameProps) {

return (
	<div className="bg-white/4 border border-white/10 duration-200 hover:bg-hbg hover:border-hbbg relative flex items-center justify-between overflow-hidden rounded-2xl px-5 py-6 transition-all">
		<div
			className={`w-19 h-8 absolute -top-1 left-1/2 flex -translate-x-1/2 items-end justify-center pb-1 ${
				outcome === 'W' ? "bg-green-600" : outcome === 'L' ? "bg-red-600" : "bg-gray-600"
			} border-1 border-gray-600 rounded-b-lg`}
		>
			<p className="text-sm">
				{outcome === 'W' ? 'Victory' : outcome === 'L' ? 'Defeat' : 'Draw'}
			</p>
		</div>
		<div className="w-19 bg-gray-thick border border-white/15 absolute -bottom-1 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-t-lg">
			<Image
				src={game_type === "XO" ? "/icons/XO.svg" : "/icons/ping-pong.svg"}
				width={game_type === "XO" ? 30 : 18}
				height={game_type === "XO" ? 30 : 18}
				alt="Profile Image"
			/>
		</div>
		<div className="flex w-[30%] items-center gap-4">
			<div
				className="flex aspect-square h-[40px] w-[40px] items-center
					justify-center rounded-full lg:h-[45px] lg:w-[45px]"
			>
				<Image
					className={`ring-fr-image h-full w-full rounded-full object-cover
						${outcome === 'W' ? 'ring-3 ring-green-500' : outcome === 'L' ? 'ring-3 ring-red-500' : 'ring-3 ring-gray-500'}`}
						// ${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score > gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`
						// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult >= 1 ? "ring-3 ring-green-500" : "ring-2"}`}
					// src={gameInfo.player_home.avatar}
					src={`http://localhost:4025/api/users${user_avatar_path}`}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>
			<p className="text-wrap truncate">{user_username}</p>
		</div>
		<p className="text-xl font-bold">{user_score}</p>
		<div className="text-sm italic text-gray-500">{50} XP</div>
		<p className="text-xl font-bold">{opp_score}</p>
		<div className="flex w-[30%] items-center justify-end gap-4">
			<p className="text-wrap truncate text-right">{opponent_username}</p>
			<div
				className="flex aspect-square h-[40px] w-[40px] items-center
				justify-center rounded-full lg:h-[45px] lg:w-[45px]"
			>
				<Image
					className={`ring-fr-image h-full w-full rounded-full object-cover
						${outcome === 'W' ? 'ring-3 ring-red-500' : outcome === 'L' ? 'ring-3 ring-green-500' : 'ring-3 ring-gray-500'}`}
					// ${gameInfo.player_home.score === gameInfo.player_away.score ? "ring-3 ring-gray-600" : gameInfo.player_home.score < gameInfo.player_away.score ? "ring-3 ring-green-500" : "ring-2"}`}
						// ${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult <= -1 ? "ring-3 ring-green-500" : "ring-2"}`}
					// src={gameInfo.player_away.avatar}
					src={`http://localhost:4025/api/users${opponent_avatar_path}`}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>
		</div>
	</div>
);
}


export default function ProfileSnapshotV2() {
	const { loggedInUser, apiClient } = useAuth();
	const [userAnalytics, setUserAnalytics] = useState<ProfileSnapshotProps | null>(null);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [index, setIndex] = useState(0);
	
	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				const analytics = await apiClient.fetchUserAnalytics(loggedInUser!.username);
				const profile = await apiClient.fetchUser(loggedInUser!.username);
				console.log('fetched user analytics: ', analytics);
				console.log('fetched user profile: ', profile);
				setUserAnalytics(analytics);
				setUserProfile(profile);
			} catch (err) {
				console.log(err);
			}
		}
	
		fetchUserAnalytics();
	}, [loggedInUser]);

	function flattenData(obj: Record<string, any>) {
		return Object.keys(obj)
		.filter(key => PREFIX[key] !== undefined)
		.map(key => ({
			prefix: PREFIX[key],
			value: obj[key],
			suffix: SUFFIX[key],
			decimals: DECIMALS[key]
		}));
	}
	
	const recordsArray = userProfile ? flattenData(userProfile.userRecords || {}) : [];
	const totalsArray = userAnalytics ? flattenData(userAnalytics.totals || {}) : [];
	const scoresArray = userAnalytics ? flattenData(userAnalytics.scores || {}) : [];
	const durationsArray = userAnalytics ? flattenData(userAnalytics.durations || {}) : [];
	const timeSpent = userProfile ? userProfile.userRecentTimeSpent.map(d => ({ date: d.day, timeSpent: (d.total_duration / 3600).toFixed(1) })) : {};
	
	useEffect(() => {
		if (recordsArray.length === 0) return;
		const id = setInterval(() => {
			setIndex((prev) => {
				if (prev === recordsArray.length - 1) return 0;
				return prev + 1;
			});
		}, 10000);
		return () => clearInterval(id);
	}, [recordsArray.length]);
	
	const recordStatToShow = recordsArray[index];
	const totalStatToShow = totalsArray[index];
	const scoreStatToShow = scoresArray[index];
	const durationStatToShow = durationsArray[index];
	const matchToShow = userProfile ? userProfile.userRecentMatches[index] || userProfile.userRecentMatches[0] : null;

	console.log('debug: ', {recordStatToShow, totalStatToShow, scoreStatToShow, durationStatToShow});
	
	if (!userAnalytics) return <div>Loading...</div>;
	
	return (
		<aside
			className={`flex-3 min-h-130 max-h-220 flex h-full w-full flex-col gap-4`}
		>
			<section className={`bg-card border-br-card h-full w-full flex-1 rounded-2xl border-1 select-none`}>
					<div className="flex h-full flex-col">
						<div className="group relative shrink-0 overflow-hidden">
							<h1 className={`${funnelDisplay.className} font-bold pt-10 pb-6 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}>
								Snapshots
							</h1>
							<div
								className="w-18 h-5 absolute
										left-0 top-[calc(59%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0]
										transition-all duration-200 group-hover:scale-105"
							></div>
						</div>
						<div className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
							<div className={`pl-8 pr-8 flex h-full flex-col gap-4 pb-4 ${funnelDisplay.className}`}>
								{matchToShow &&
									<div>
										<p className='text-base text-white/60 font-semibold text-center'>Recent Matches</p>
										<div className='relative overflow-hidden hover:scale-101 transition-all duration-300'>
											<AnimatePresence mode='popLayout' >
												<motion.div
													key={matchToShow.match_id}
													initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
													animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
													exit={{ opacity: 0, y: -50, filter: "blur(5px)" }}
													transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
													className=""
												>
												<Game
													match_id={matchToShow?.match_id}
													game_type={matchToShow?.game_type}
													started_at={matchToShow?.started_at}
													finished_at={matchToShow?.finished_at}
													user_id={matchToShow?.user_id}
													user_username={matchToShow?.user_username}
													user_avatar_path={matchToShow?.user_avatar_path}
													user_score={matchToShow?.user_score}
													opp_score={matchToShow?.opp_score}
													opponent_id={matchToShow?.opponent_id}
													opponent_username={matchToShow?.opponent_username}
													opponent_avatar_path={matchToShow?.opponent_avatar_path}
													duration={matchToShow?.duration}
													outcome={matchToShow?.outcome}
													/>
												</motion.div>
											</AnimatePresence>
										</div>
									</div>
								}

									{/* <motion.div
										key={recordStatToShow.prefix}
										initial={{ opacity: 0, filter: "blur(5px)" }}
										animate={{ opacity: 1, filter: "blur(0px)" }}
										exit={{ opacity: 0, filter: "blur(5px)" }}
										transition={{ duration: 0.5, ease: 'easeInOut' }}
										className="bg-white/4 border border-white/10 hover:scale-101 rounded-2xl pl-4 pr-4 pt-2 pb-2
										flex flex-row items-center justify-between backdrop-blur-xl
										lg:flex-row transition-transform duration-200 hover:bg-white/6 overflow-hidden"
									> */}
								<div className='bg-white/4 border border-white/10 min-h-14 hover:scale-101 
									overflow-hidden rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
									duration-200 sm:flex-row sm:justify-between hover:bg-white/6'
								>
									<AnimatePresence mode='popLayout' >
										<motion.div
											key={recordStatToShow.prefix}
											initial={{ opacity: 0, x: -50, filter: "blur(5px)" }}
											animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
											exit={{ opacity: 0, x: 50, filter: "blur(5px)" }}
											transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
											className="flex flex-row items-center justify-between
												lg:flex-row"
										>
											<p className="text-2xl text-white/60 font-bold">{recordStatToShow.prefix}</p>
											<p className="text-3xl text-white/80 font-bold">
												<CountUp 
													end={recordStatToShow.value} 
													suffix={recordStatToShow.suffix} 
													duration={2} 
													useEasing={true} 
												/>
											</p>
										</motion.div>
									</AnimatePresence>
								</div>
								
								<div className="flex w-full gap-3 text-center">
									<div className='bg-white/4 border border-white/10 hover:scale-101 
										overflow-hidden rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200 sm:flex-row sm:justify-between hover:bg-white/6 flex-1'
									>
										<AnimatePresence mode='popLayout' >
											<motion.div
												key={totalStatToShow.prefix}
												initial={{ opacity: 0, y: 60, filter: "blur(5px)" }}
												animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
												exit={{ opacity: 0, y: -60, filter: "blur(5px)" }}
												transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.9 }}
												className="flex flex-row items-center justify-between
												lg:flex-row"
											>
												<p className="text-xl text-white/60 font-bold text-start">
													{totalStatToShow.prefix.split(' ')[0]}
													<br />
													{totalStatToShow.prefix.split(' ')[1]}
												</p>
												<p className="text-3xl text-white/80 font-bold">
													<CountUp 
														end={totalStatToShow.value} 
														suffix={totalStatToShow.suffix} 
														duration={2} 
														useEasing={true} 
													/>
												</p>
											</motion.div>
										</AnimatePresence>
									</div>
									<div className='bg-white/4 border border-white/10 hover:scale-101 
										overflow-hidden rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200 sm:flex-row sm:justify-between hover:bg-white/6 flex-1'
									>
										<AnimatePresence mode='popLayout' >
											<motion.div
												key={scoreStatToShow.prefix}
												initial={{ opacity: 0, y: -60, filter: "blur(5px)" }}
												animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
												exit={{ opacity: 0, y: 60, filter: "blur(5px)" }}
												transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
												className="flex flex-row items-center justify-between
													lg:flex-row"
											>
												<p className="text-xl text-white/60 font-bold text-start">
													{scoreStatToShow.prefix.split(' ')[0]}
													<br />
													{scoreStatToShow.prefix.split(' ')[1]}
												</p>
												<p className="text-3xl text-white/80 font-bold">
													<CountUp 
														end={scoreStatToShow.value} 
														suffix={scoreStatToShow.suffix} 
														duration={2} 
														useEasing={true} 
													/>
												</p>
											</motion.div>
										</AnimatePresence>
									</div>
								</div>
	
								<div className='bg-white/4 border border-white/10 min-h-14 hover:scale-101 
										overflow-hidden rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200 sm:flex-row sm:justify-between hover:bg-white/6'
								>
									<AnimatePresence mode='popLayout' >
										<motion.div
											key={durationStatToShow.prefix}
											initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
											animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
											exit={{ opacity: 0, x: -50, filter: "blur(5px)" }}
											transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.6 }}
											className="flex flex-row items-center justify-between
												lg:flex-row"
										>
											<p className="text-2xl text-white/60 font-bold">{durationStatToShow.prefix}</p>
											<p className="text-3xl text-white/80 font-bold">
												<CountUp 
													end={durationStatToShow.value} 
													suffix={durationStatToShow.suffix} 
													duration={2} 
													useEasing={true} 
												/>
											</p>
										</motion.div>
									</AnimatePresence>
								</div>

								<div
									className="jusitfy-between bg-white/4 border border-white/10 min-h-70 hover:scale-101 flex h-full
											w-full flex-1 flex-col items-center backdrop-blur-xl
											gap-3 overflow-hidden rounded-2xl pt-5 transition-all duration-200 hover:bg-white/6"
								>
									<p className="text-xl text-white/60 font-bold">Time Spent on Platform</p>
									<div className="relative h-full w-full">
										{Object.keys(timeSpent).length === 0 ? (
											<div className="flex flex-col justify-center items-center w-full h-full gap-2">
												<Image
													src={'/meme/thinking.gif'}
													width={360}
													height={360}
													alt="No data available"
													className="rounded-2xl blur-[1.25px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
													draggable={false}
												>
												</Image>
												<h1 className="text-white/60">No data available</h1>
											</div>
											) : (
												<Chart data={timeSpent} dataKey="timeSpent" unit="hours" />
											) 
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
		</aside>
	);
};
