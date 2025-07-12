'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import useUserProfile from '../context/useUserProfile';
import ProfileCard from '../components/ProfileCard';

export default function UserProfilePage({ params } : { params: Promise<{ username: string }> }) {
	const { username } = use(params);
	const { isLoading, userProfile: userData } = useUserProfile(username);
	
	if (isLoading || !userData)
		return null;
	// return ( <ProgressBar complete={userData !== null} /> );

	const userProfile = userData.user;

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<ProfileCard 
						fullName={userData.user.first_name + ' ' + userData.user.first_name}
					/>
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						{/* <Performance user={userData} /> */}
						{/* <GamesHistory user={userData} /> */}
					</div>
				</article>
				{/* <FriendsPanel /> */}
			</div>
			{/* <Modal /> */}
		</motion.main>
	);
}
