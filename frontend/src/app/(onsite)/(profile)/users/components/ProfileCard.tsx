import React from 'react';
import Image from 'next/image';
import { IUserInfo, IUserPerformance } from '../../me/page';
import funnelDisplay from '@/app/fonts/FunnelDisplay';

export default function ProfileCard({ userInfo, userPerformance } : { userInfo: IUserInfo, userPerformance: IUserPerformance } ) {
	return (
		<div className="flex-3 flex h-full w-full flex-col items-center gap-4 lg:gap-0">
			<div className="flex h-full w-full flex-1 items-center">
				<div className="flex-5">
					<h1 className={`text-4xl lg:text-5xl text-accent font-bold ${funnelDisplay.className} uppercase`}>
						{userInfo.first_name + ' ' + userInfo.last_name}
					</h1>
					<p className="text-sm text-gray-400 lg:text-lg">
						{/* {userInfo.bio} */}
						Something went wrong, please try again later.
					</p>
				</div>
				<div className="flex-3 flex h-full items-center justify-end">
					<div
						className="ring-5 hover:ring-6 flex aspect-square h-[80%]
							items-center justify-center overflow-hidden rounded-full
							ring-white/10 transition-all duration-500 hover:scale-105 hover:ring-white/30
							"
					>
						<Image
							className={`h-full w-full object-cover`}
							src={"/profile/image.png"}
							// src={userInfo.avatar_url}
							width={100}
							height={100}
							quality={100}
							alt="Profile Image"
						/>
					</div>
				</div>
			</div>
			<div className="flex h-[16%] w-full flex-col justify-end">
				<div>
					<div className="flex h-full flex-col gap-1">
						<div className="flex justify-between">
							<p className="font-semibold">Level {userPerformance.level}</p>
							<p className="text-gray-300">60%</p>
						</div>
						<div className="h-full w-full">
							<div className="bg-card h-2 w-full rounded-full">
								<div className="bg-accent h-2 w-[60%] rounded-full"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
