import React, { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import MainCardWithHeader from "../../UI/MainCardWithHeader";
import { motion, AnimatePresence } from "framer-motion";
import FriendsCardItem from "./FriendsCardItem";
import { PlaceholderComponent } from "@/app/(auth)/components/UI/LoadingComponents";
import { LoadingSkeletonList } from "./FriendsCardSkeleton";
import { useTranslations } from "next-intl";
import useAPIQuery from "@/app/hooks/useAPIQuery";

export default function FriendsCard() {
	const t = useTranslations("dashboard.titles");
	const tp = useTranslations('placeholders.data.friends');

	const {
		loggedInUser,
		apiClient,
		socket
	} = useAuth();

	const {
		isLoading,
		error,
		data: friends,
		refetch
	} = useAPIQuery(
		() => apiClient.user.fetchFriends()
	);

	useEffect(() => {
		function handleRelationUpdate(event: { eventType: string, data: Record<string, any> }) {
			if (!socket || !loggedInUser)
				return ;

			if (event.eventType !== 'RELATION_UPDATE')
				return ;

			if ((event.data.status === 'FRIENDS' || event.data.status === 'NONE') && (event.data.requesterId === loggedInUser.id || event.data.receiverId === loggedInUser.id))
				refetch();
		}

		socket.on('user', handleRelationUpdate);

		return () => {
			socket.off('user', handleRelationUpdate);
		};
	}, []);

	const showSkeleton = isLoading && !friends; // first fetch

	return (
		<MainCardWithHeader headerName={t('friends')} className='font-funnel-display flex-2 scroll-smooth hidden 2xl:block'>
			<div className="group flex flex-col gap-3 px-6 h-full">
				{showSkeleton ? (
					<LoadingSkeletonList count={12} />
				) : error ? (
					<PlaceholderComponent content={tp('error')} />
				) : !friends || friends.length === 0 ? (
					<PlaceholderComponent content={tp('no-data')} />
				) : (
					<AnimatePresence>
						{friends.map((item, i) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.8, delay: i * 0.15 }}
								style={{ zIndex: friends.length - i }}
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
