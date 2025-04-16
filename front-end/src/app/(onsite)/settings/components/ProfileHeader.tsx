"use client";

import Image from "next/image";

function ProfileHeader({ fullname, img }: { fullname: string; img: string }) {
	return (
		<section className="flex-[1/2]">
			<div className="h-45 md:h-30 flex w-full max-w-full flex-[1/2] flex-col overflow-hidden md:flex-row md:gap-20">
				<h1 className="flex h-full items-center px-5 py-7 text-3xl font-semibold md:py-10 lg:text-4xl">
					Settings
				</h1>
				<div className="flex h-full w-full items-center justify-center gap-6 px-5 md:px-0">
					<div className="h-17 w-17 min-h-17 min-w-17 max-h-17 max-w-17 overflow-hidden rounded-full ring-4 ring-white/10">
						<Image
							src={img}
							alt="Profile Image"
							width={96}
							height={96}
							className="h-full w-full object-cover"
							quality={100}
						/>
					</div>
					<div className="text-wrap flex h-full w-full flex-col justify-center overflow-hidden truncate">
						<h1 className={`text-3xl font-semibold lg:text-4xl`}>
							{fullname}
						</h1>
						<p className="text-xs text-gray-300 lg:text-sm">
							Manage your details and personal preferences here
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ProfileHeader;
