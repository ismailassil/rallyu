import React from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import Link from 'next/link';

export interface APIUserItem {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	avatar_path: string;
	updated_at: string;
}

export interface UserItem {
	id: number;
	username: string;
	avatar: string;
	fullName: string;
	since: string;
}

export interface UserAction {
	icon: React.ReactNode;
	onClick: (user_id: number) => void;
	title?: string;
	color?: string; // action button hovering color
}

interface UserListProps {
	users: UserItem[];
	actions: UserAction[];
}

export function mapAPIUserItemtoUserItem(users: APIUserItem[]) {
	const mappedUsers = users.map(usr => ({
		id: usr.id,
		username: usr.username,
		fullName: usr.first_name + ' ' + usr.last_name,
		avatar: `http://localhost:4025/api/users${usr.avatar_path}`,
		since: usr.updated_at
	}));

	return mappedUsers;
}

export default function UserList({ users, actions = [] } : UserListProps) {
	if (users.length === 0)
		return (
			<div>
				<h1 className={`text-center ${funnelDisplay.className}`}>No users found.</h1>
			</div>
		);

	return (
		<div className="grid grid-cols-2 px-18 gap-3">
			{users.map(({ id, username, avatar, fullName, since }) => (
				<div
					key={id}
					className={`${funnelDisplay.className} w-full rounded-2xl bg-gradient-to-br from-white/0 to-white/4 border border-white/10
						flex items-center justify-between py-3 px-5`}
				>
					<Link href={`/users/${username}`} className='w-full'>
					<div className="flex gap-3 items-center">
						<div className="rounded-full h-10 w-10 ring-1 ring-white/10">
							<Image
								src={avatar}
								alt="Profile Image"
								width={96}
								height={96}
								className="h-full w-full object-cover rounded-full"
								quality={100}
							/>
						</div>
						<div>
							
								<h1>{fullName}</h1>
							<p className="text-sm flex items-center gap-1 text-white/70">
								<Clock size={14} />
								{since}
							</p>
						</div>
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
								{/* <p>{action.title}</p> */}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
