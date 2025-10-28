import React from 'react';
import { motion } from 'framer-motion';
import SettingsCard from '../../SettingsCard';
import FriendsList from './FriendsList';
import BlockedList from './BlockedList';
import OutgoingFriendRequestsList from './OutgoingFriendRequestsList';
import IncomingFriendRequestsList from './IncomingFriendRequestsList';
import { useTranslations } from 'next-intl';

export default function UsersSettingsTab() {
	const t = useTranslations('settings.users');

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			<SettingsCard
				title={t('cards.friends.title')}
				subtitle={t('cards.friends.subtitle')}
				initialHeight='loading'
				isFoldable
			>
				<FriendsList />
			</SettingsCard>

			<SettingsCard
				title={t('cards.outgoing.title')}
				subtitle={t('cards.outgoing.subtitle')}
				initialHeight='loading'
				isFoldable
			>
				<OutgoingFriendRequestsList />
			</SettingsCard>

			<SettingsCard
				title={t('cards.incoming.title')}
				subtitle={t('cards.incoming.subtitle')}
				initialHeight='loading'
				isFoldable
			>
				<IncomingFriendRequestsList />
			</SettingsCard>

			<SettingsCard
				title={t('cards.blocked.title')}
				subtitle={t('cards.blocked.subtitle')}
				initialHeight='loading'
				isFoldable
			>
				<BlockedList />
			</SettingsCard>
		</motion.div>
	);
}
