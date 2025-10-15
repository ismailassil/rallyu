import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import MainCardWithHeader from '../../../components/UI/MainCardWithHeader';
import GameCard from '../../../users/components/GamesHistory/GameCard';
import { secondsToHMS } from '@/app/(api)/utils';
import ChartCardWrapper from '../../../performance/components/Charts/ChartCardWrapper';
import { useTranslations } from 'next-intl';
import CustomAreaChart from '../../../performance/components/Charts/CustomAreaChart';
import { SnapshotSkeleton } from './SnapshotCardSkeleton';
import useAPICall from '@/app/hooks/useAPICall';
import { EmptyComponent } from '@/app/(auth)/components/UI/LoadingComponents';
import { flattenStats } from './constants';
import { HalfWidthStatDisplay } from './components/HalfWidthStatDisplay';
import { FullWidthStatDisplay } from './components/FullWidthStatDisplay';


export default function SnapshotCard() {
	const t = useTranslations("dashboard.titles");
	const [index, setIndex] = useState(0);

	const {
		loggedInUser,
		apiClient
	} = useAuth();

	const {
		executeAPICall: fetchUserAnalytics,
		isLoading: isFetchingAnalytics,
		data: userAnalytics,
		error: userAnalyticsError
	} = useAPICall();

	const {
		executeAPICall: fetchUserProfile,
		isLoading: isFetchingUserProfile,
		data: userProfile,
		error: userProfileError
	} = useAPICall();

	const isLoading = isFetchingAnalytics || isFetchingUserProfile;
  	const isError = userProfileError || userAnalyticsError;

	useEffect(() => {
		if (!loggedInUser)
			return;
		fetchUserProfile(() => apiClient.user.fetchUser(loggedInUser.id));
		fetchUserAnalytics(() => apiClient.user.fetchUserAnalytics(loggedInUser.id));
	}, [apiClient.user, fetchUserAnalytics, fetchUserProfile, loggedInUser]);

	const records = flattenStats(userProfile?.userRecords);
  	const totals = flattenStats(userAnalytics?.totals);
  	const scores = flattenStats(userAnalytics?.scores);
  	const durations = flattenStats(userAnalytics?.durations);

	useEffect(() => {
		if (records.length === 0)
			return;
		const id = setInterval(() => {
			setIndex((prev) => (prev + 1) % records.length);
		}, 8000);
		return () => clearInterval(id);
  	}, [records.length]);

	if (isLoading) {
		return (
		<MainCardWithHeader headerName={t("snapshots")} color="notwhite" className="font-funnel-display flex-3 select-none">
			<div className="group flex flex-col gap-4">
			<SnapshotSkeleton />
			</div>
		</MainCardWithHeader>
		);
	}

  	if (isError) {
		return (
		<MainCardWithHeader headerName={t("snapshots")} color="notwhite" className="font-funnel-display flex-3 select-none">
			<div className="group flex flex-col gap-4">
			<EmptyComponent content={isError} />
			</div>
		</MainCardWithHeader>
		);
	}

  	if (!userAnalytics || !userProfile) return null;

	const matchToShow = userProfile.userRecentMatches[index] || userProfile.userRecentMatches[0];
	const timeSpentData = userProfile.userRecentTimeSpent?.map((item: any) => ({
		date: item.day,
		value: item.total_duration,
	})) || [];

	const currentRecord = records[index];
	const currentTotal = totals[index];
	const currentScore = scores[index];
	const currentDuration = durations[index];


	return (
		<MainCardWithHeader headerName={t("snapshots")} color="notwhite" className="font-funnel-display flex-3 select-none">
			<div className="group flex flex-col gap-4">
				{matchToShow && (
				<div className="relative px-6 py-0.5 overflow-hidden">
					<AnimatePresence mode="popLayout">
						<motion.div
							key={matchToShow.match_id}
							initial={{ opacity: 0, y: 100, filter: "blur(5px)", scale: 0.9 }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
							exit={{ opacity: 0, y: -20, filter: "blur(5px)", scale: 0.9 }}
							transition={{ duration: 0.5, ease: 'easeInOut' }}
						>
							<GameCard {...matchToShow} />
						</motion.div>
					</AnimatePresence>
				</div>
				)}

				<div className="px-6 flex flex-col gap-4">
					{currentRecord && (
					<div className="profile-inner-stat-card-animated flex-1 relative">
						<FullWidthStatDisplay stat={currentRecord} direction="left" />
					</div>
					)}

					<div className="flex w-full gap-4 text-center">
					{currentTotal && (
						<div className="profile-inner-stat-card-animated flex-1 relative">
						<HalfWidthStatDisplay stat={currentTotal} direction="down" delay={0.9} />
						</div>
					)}
					{currentScore && (
						<div className="profile-inner-stat-card-animated flex-1 relative">
						<HalfWidthStatDisplay stat={currentScore} direction="up" delay={0.3} />
						</div>
					)}
					</div>

					{currentDuration && (
						<div className="profile-inner-stat-card-animated flex-1 relative">
							<FullWidthStatDisplay stat={currentDuration} direction="right" delay={0.6} />
						</div>
					)}

					<ChartCardWrapper
						chartTitle="Time Spent in the Platform"
						className="h-110"
						isEmpty={timeSpentData.length === 0}
					>
						<CustomAreaChart
						data={timeSpentData}
						dataKeyX="date"
						dataKeyY="value"
						tooltipFormatter={secondsToHMS}
						/>
					</ChartCardWrapper>
				</div>
			</div>
		</MainCardWithHeader>
	);
};
