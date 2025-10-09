import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '../../contexts/AuthContext';
import Chart from '../../users/components/Chart';
import MainCardWithHeader from '../UI/MainCardWithHeader';
import GameCard from '../../users/components/GameCard';
import { secondsToHMS, secondsToMinutes } from '@/app/(api)/utils';
import ChartCardWrapper from '../../charts/components/ChartCardWrapper';
import { useTranslations } from 'next-intl';
import CustomAreaChart from '../../charts/components/CustomAreaChart';

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
	total_xp: " XP",
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
	
	total_duration: "m",
	max_duration: "m",
	min_duration: "m",
	avg_duration: "m"
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

export default function SnapshotCard() {
	const { loggedInUser, apiClient } = useAuth();
	const [userAnalytics, setUserAnalytics] = useState<ProfileSnapshotProps | null>(null);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [index, setIndex] = useState(0);
	const t = useTranslations("dashboard.titles");
	
	useEffect(() => {
		async function fetchUserAnalytics() {
			try {
				const analytics = await apiClient.fetchUserAnalytics(loggedInUser!.id);
				const profile = await apiClient.fetchUser(loggedInUser!.id);
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
		.map(key => {
			return {
				prefix: PREFIX[key],
				value: key.includes('duration') ? secondsToMinutes(obj[key]) : obj[key],
				suffix: SUFFIX[key],
				decimals: DECIMALS[key]
			};
		});
	}
	
	const recordsArray = userProfile ? flattenData(userProfile.userRecords || {}) : [];
	const totalsArray = userAnalytics ? flattenData(userAnalytics.totals || {}) : [];
	const scoresArray = userAnalytics ? flattenData(userAnalytics.scores || {}) : [];
	const durationsArray = userAnalytics ? flattenData(userAnalytics.durations || {}) : [];
	const timeSpentToShow = userProfile ? userProfile.userRecentTimeSpent.map((item) => ({ date: item.day, value: item.total_duration })) : {};
	
	useEffect(() => {
		if (recordsArray.length === 0) return;
		const id = setInterval(() => {
			setIndex((prev) => {
				if (prev === recordsArray.length - 1) return 0;
				return prev + 1;
			});
		}, 8000);
		return () => clearInterval(id);
	}, [recordsArray.length]);
	
	const recordStatToShow = recordsArray[index];
	const totalStatToShow = totalsArray[index];
	const scoreStatToShow = scoresArray[index];
	const durationStatToShow = durationsArray[index];
	const matchToShow = userProfile ? userProfile.userRecentMatches[index] || userProfile.userRecentMatches[0] : null;

	// console.log('debug: ', {recordStatToShow, totalStatToShow, scoreStatToShow, durationStatToShow});
	
	if (!userAnalytics) return <div>Loading...</div>;

	return (
		<MainCardWithHeader headerName={t("snapshots")} color='notwhite' className='font-funnel-display flex-3 select-none'>
			<div className="group flex flex-col gap-4">
				{matchToShow &&
					<div className='relative px-6 py-0.5 overflow-hidden'>
						<AnimatePresence mode='popLayout'>
							<motion.div
								key={matchToShow.match_id}
								initial={{ opacity: 0, y: 100, filter: "blur(5px)", scale: 0.9 }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
								exit={{ opacity: 0, y: -20, filter: "blur(5px)", scale: 0.9 }}
								transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
								className=""
							>
								<GameCard
									match_id={matchToShow?.match_id}
									game_type={matchToShow?.game_type}
									started_at={matchToShow?.started_at}
									finished_at={matchToShow?.finished_at}
									user_id={matchToShow?.user_id}
									user_username={matchToShow?.user_username}
									user_avatar_url={matchToShow?.user_avatar_url}
									user_score={matchToShow?.user_score}
									opp_score={matchToShow?.opp_score}
									opponent_id={matchToShow?.opponent_id}
									opponent_username={matchToShow?.opponent_username}
									opponent_avatar_url={matchToShow?.opponent_avatar_url}
									duration={matchToShow?.duration}
									outcome={matchToShow?.outcome}
								/>
							</motion.div>
						</AnimatePresence>
					</div>
				}
				<div className='px-6 flex flex-col gap-4'>
					<div className='profile-inner-stat-card-animated flex-1 relative'
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
										duration={5} 
										useEasing={true} 
									/>
								</p>
							</motion.div>
						</AnimatePresence>
					</div>
									
					<div className="flex w-full gap-4 text-center">
						<div className='profile-inner-stat-card-animated flex-1 relative'
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
											duration={5} 
											useEasing={true} 
										/>
									</p>
								</motion.div>
							</AnimatePresence>
						</div>
						<div className='profile-inner-stat-card-animated flex-1 relative'
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
											duration={5} 
											useEasing={true} 
										/>
									</p>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					<div className='profile-inner-stat-card-animated flex-1 relative'
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
										duration={5} 
										useEasing={true} 
									/>
								</p>
							</motion.div>
						</AnimatePresence>
					</div>

					<ChartCardWrapper
						chartTitle='Time Spent in the Platform'
						className='h-110'
						isEmpty={timeSpentToShow.length === 0}
					>
						<CustomAreaChart data={timeSpentToShow} dataKeyX='date' dataKeyY='value' tooltipFormatter={secondsToHMS} />
					</ChartCardWrapper>
				</div>
			</div>
		</MainCardWithHeader>
	);
};
