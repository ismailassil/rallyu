"use client";

import unicaOne from "@/app/fonts/unicaOne";
import Image from "next/image";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { IUserInfo, IUserPerformance } from "../../me/page";

function UserPanel({ userInfo, userPerformance } : { userInfo: IUserInfo, userPerformance: IUserPerformance } ) {
	const { user } = useAuth();
	console.log('UserPanel');
	console.log('AuthUsername: ', user?.username);
	console.log('DynamicUsername: ', userInfo.username);

	return (
		<header
			className="bg-card border-br-card flex w-full flex-col items-center gap-12
						overflow-hidden rounded-2xl border-1 p-10
						min-h-[300px] max-h-[400px]
						sm:min-h-[300px]
						md:min-h-[300px] md:max-h-[400px]
						lg:flex-row"
		>
			<div className="flex-5 flex h-full w-full flex-col items-center justify-between">
				<div className="flex h-full w-full flex-1 items-center">
					<div className="flex-5">
						<h1 className={`text-4xl lg:text-5xl ${unicaOne.className}`}>
							<span className="text-accent font-semibold">
								{userInfo.first_name + ' ' + userInfo.last_name}
							</span>
						</h1>
						<p className="text-sm text-gray-500 lg:text-lg">
							{/* {userInfo.bio} */}
							Something went wrong, please try again later.
						</p>
					</div>
					<div className="flex-3 flex h-full items-center justify-center">
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
								<p className="text-gray-600">60%</p>
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

			<div
				className={`*:hover:scale-102 *:duration-200 *:transform flex h-full w-full flex-row gap-4 uppercase lg:w-[25%] lg:flex-col ${unicaOne.className}`}
			>
				<div className="bg-inner-card border-br-card flex flex-1 items-end justify-between rounded-2xl border-2 p-4 px-4">
					<p className="text-lg lg:text-2xl">Wins</p>
					<p className="text-3xl lg:text-4xl">{userPerformance.games.wins}</p>
				</div>
				<div className="bg-inner-card border-br-card flex flex-1 items-end justify-between rounded-2xl border-2 p-4 px-4">
					<p className="text-lg lg:text-2xl">Defeats</p>
					<p className="text-3xl lg:text-4xl">{userPerformance.games.losses}</p>
				</div>
				<div className="bg-inner-card border-br-card flex flex-1 items-end justify-between rounded-2xl border-2 p-4 px-4">
					<p className="text-lg lg:text-2xl">Draws</p>
					<p className="text-3xl lg:text-4xl">{userPerformance.games.draws}</p>
				</div>
			</div>
		</header>
	);
}

export default UserPanel;
