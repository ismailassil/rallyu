import React from 'react';

type ProfileCardProps = {
	fullName: string,
	bio: string,
	friendshipStatus: string,
	level: number,
	globalRank: number,
	winRate: number,
	currentStreak: number
};

export default function ProfileCard({ fullName, bio, friendshipStatus, level, globalRank, winRate, currentStreak } : ProfileCardProps) {
	return (
		<header
			className="bg-card border-br-card flex w-full flex-col items-center gap-12
						overflow-hidden rounded-2xl border-1 p-10
						min-h-[300px] max-h-[400px]
						sm:min-h-[300px]
						md:min-h-[360px] md:max-h-[400px]
						lg:flex-row"
		>
		</header>
	);
}
