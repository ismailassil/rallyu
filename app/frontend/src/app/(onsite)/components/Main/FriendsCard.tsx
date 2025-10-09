import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MainCardWithHeader from "../UI/MainCardWithHeader";
import { motion, AnimatePresence } from "framer-motion";
import FriendsCardItem from "./FriendsCardItem";


export default function FriendsCard() {
	const [friends, setFriends] = useState([]);
	const { apiClient } = useAuth();
	// const t = useTranslations("dashboard.titles");

	useEffect(() => {
		async function fetchLeaderboard() {
			try {
				const data = await apiClient.getAllFriends();
				setFriends(data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchLeaderboard();
	}, []);

	if (friends.length === 0)
		return <h1>Loading...</h1>;

	return (
		<MainCardWithHeader headerName='Friends' className='font-funnel-display flex-2 scroll-smooth hidden 2xl:block'>
			<div className="group flex flex-col gap-3 px-6">
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
								username={item.username}
								avatar={item.avatar_url}
								isOnline={true}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</MainCardWithHeader>
	);
}
