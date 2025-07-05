'use client';
import { use, useState, useEffect } from 'react';
import { IUserProfile } from '../../me/page';
import { useAuth } from '../../../contexts/AuthContext';
import ProgressBar from '@/app/(auth)/components/ProgressBar';
import { motion } from "framer-motion";
import FriendsPanel from "../../../components/Main/FriendsPanel";
import Performance from "../../components/Performance";
import GamesHistory from "../../components/GamesHistory";
import UserPanel from "../components/UserPanel";
 
export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const { api } = useAuth();
	const { username } = use(params);
	// return <h1 className='fixed top-50'>Username: {username}</h1>;

	const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);

	useEffect(() => {
		async function fetchProfile() {
			const profile = await api.getUserProfile(username);
			setUserProfile(profile);
		}
		fetchProfile();
	}, []);

	if (!userProfile)
		return ( <ProgressBar complete={userProfile !== null} /> );

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<UserPanel userInfo={userProfile.profile} userPerformance={userProfile.performance}/>
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						<Performance userPerformance={userProfile.performance} />
						<GamesHistory userGames={userProfile.games_history} />
					</div>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
