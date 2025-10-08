import React from 'react';
import { motion } from 'framer-motion';
import SettingsCard from '../../SettingsCard';
import FriendsList from './FriendsList';
import BlockedList from './BlockedList';
import OutgoingFriendRequestsList from './OutgoingFriendRequestsList';
import IncomingFriendRequestsList from './IncomingFriendRequestsList';

export default function UsersSettingsTab() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			<SettingsCard 
				title="Friends"
				subtitle="View and manage relationship with all of your friends"
				isFoldable={true}
				defaultExpanded={true}
			>
				<FriendsList />
			</SettingsCard>

			<SettingsCard 
				title="Outgoing Friend Requests"
				subtitle="View and cancel all the pending friend requests you've sent"
				isFoldable={true}
				defaultExpanded={true}
			>
				<OutgoingFriendRequestsList />
			</SettingsCard>

			<SettingsCard 
				title="Incoming Friend Requests"
				subtitle="View and decline all the pending friend requests you've received"
				isFoldable={true}
				defaultExpanded={true}
			>
				<IncomingFriendRequestsList />
			</SettingsCard>

			<SettingsCard 
				title="Blocked Users"
				subtitle="View and unblock all the users you have blocked"
				isFoldable={true}
				defaultExpanded={true}
			>
				<BlockedList />
			</SettingsCard>
		</motion.div>
	);
}
