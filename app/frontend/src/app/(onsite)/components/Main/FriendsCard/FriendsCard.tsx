import React, { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import MainCardWithHeader from "../../UI/MainCardWithHeader";
import { motion, AnimatePresence } from "framer-motion";
import FriendsCardItem from "./FriendsCardItem";
import useAPICall from "@/app/hooks/useAPICall";
import { EmptyComponent } from "@/app/(auth)/components/UI/LoadingComponents";
import { LoadingSkeletonList } from "./FriendsCardSkeleton";
import { useTranslations } from "next-intl";

export default function FriendsCard() {
	const t = useTranslations("dashboard.titles");

	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall,
		isLoading,
		data: friends,
		error
	} = useAPICall();


	useEffect(() => {
		async function fetchFriends() {
			try {
				await executeAPICall(() => apiClient.user.fetchFriends());
			} catch (err) {
				console.error(err);
			}
		}
		fetchFriends();
	}, []);

	return (
		<MainCardWithHeader headerName={t('friends')} className='font-funnel-display flex-2 scroll-smooth hidden xl:block'>
			<div className="group flex flex-col gap-3 px-6 h-full">
				{isLoading ? (
					<LoadingSkeletonList
						count={12}
					/>
				) : error ? (
					<EmptyComponent content={error} />
				) : !friends ? (
					null
				) : friends.length === 0 ? (
					<EmptyComponent content={'No friends found. Go touch some grass.'} />
				) : (
					<AnimatePresence>
						{friends.map((item, i) => (
							<motion.div
								key={item.username}
								initial={{ opacity: 0, y: -40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: i * 0.15 }}
								style={{ zIndex: friends.length - i }}
								className='bg-red-500/0'
							>
								<FriendsCardItem
									id={item.id}
									username={item.username}
									avatar={item.avatar_url}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>
		</MainCardWithHeader>
	);
}
