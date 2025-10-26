import React from 'react';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { relativeTimeAgoFromNow } from '@/app/(api)/utils';
import Avatar from '@/app/(onsite)/users/components/Avatar';

export interface UserItem {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	avatar_url: string;
	created_at: number;
}

export interface UserAction {
	icon: React.ReactNode;
	onClick: (id: number) => void;
	title?: string;
	color?: string;
}

interface UserListProps {
	users: UserItem[];
	actions: UserAction[];
}

interface UserCardProps {
	user: UserItem,
	actions: UserAction[]
}

function UserCard({ user, actions } : UserCardProps) {
	const { id, username, first_name, last_name, created_at, avatar_url } = user;

	return (
		<div
			key={id}
			className='rounded-2xl bg-linear-to-br from-white/0 to-white/4 border border-white/10
				flex items-center justify-between py-3 px-5'
		>
			<Link href={`/users/${username}`} className='flex gap-3 items-center'>
					<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
						<Avatar
							avatar={avatar_url}
							className='h-full w-full'
						/>
					</div>
					<div>
						<h1 className='text-sm sm:text-base'>{first_name + ' ' + last_name}</h1>
						<p className="text-xs sm:text-sm flex items-center gap-1 text-white/70">
							<Clock size={14} />
							{relativeTimeAgoFromNow(created_at)}
						</p>
					</div>
			</Link>

			<div className="flex items-center gap-2">
				{actions.map((action, index) => (
					<div
						key={index}
						onClick={() => action.onClick(id)}
						className={`cursor-pointer transition-all duration-300 flex gap-2 items-center`}
						title={action.title}
					>
						{action.icon}
					</div>
				))}
			</div>
		</div>
	);
}

export default function UserList({ users, actions = [] } : UserListProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			{users.map((user) =>
				<UserCard
					key={user.id}
					user={user}
					actions={actions}
				/>
			)}
		</div>
	);
}
