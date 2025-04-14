"use client";

import Image from "next/image";

function ProfileHeader({ fullname, img }: { fullname: string; img: string }) {
	return (
		<section className="flex-[1/2]">
			<div className="max-w-full flex-[1/2] h-45 md:h-30 flex flex-col md:flex-row w-full md:gap-20 overflow-hidden">
				<h1 className="text-3xl lg:text-4xl py-7 md:py-10 px-5 font-semibold flex items-center h-full">
					Settings
				</h1>
				<div className="w-full h-full flex gap-6 items-center justify-center px-5 md:px-0">
					<div className="h-17 w-17 min-h-17 min-w-17 max-h-17 max-w-17 rounded-full overflow-hidden ring-4 ring-white/10">
						<Image
							src={img}
							alt="Profile Image"
							width={96}
							height={96}
							className="object-cover w-full h-full"
							quality={100}
						/>
					</div>
					<div className="w-full h-full flex flex-col justify-center overflow-hidden truncate text-wrap">
						<h1 className={`text-3xl lg:text-4xl font-semibold`}>{fullname}</h1>
						<p className="text-xs lg:text-sm text-gray-300">
							Manage your details and personal preferences here
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ProfileHeader;
