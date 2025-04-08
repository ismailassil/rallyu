import Image from "next/image";

interface ProfileProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isProfile: boolean;
	profileRef: React.Ref<HTMLDivElement>;
}

export default function Profile({
	setIsNotif,
	setIsProfile,
	setIsSearch,
	isProfile,
	profileRef,
}: ProfileProps) {
	return (
		<div className="relative" ref={profileRef}>
			<button
				className={`relative hover:cursor-pointer ml-4 rounded-full bg-card border-2
			border-br-card w-[55px] h-[55px] flex justify-center items-center
			${
				isProfile
					? "bg-hbg border-hbbg ring-4 \
			ring-bbg scale-101"
					: "hover:bg-hbg hover:border-hbbg hover:ring-4 \
			hover:ring-bbg hover:scale-101"
			} transition-transform duration-200
			
			`}
				onClick={() => {
					setIsNotif(false);
					setIsSearch(false);
					setIsProfile(!isProfile);
				}}
			>
				<Image
					src="/profile.svg"
					alt="Notification Icon"
					width={30}
					height={30}
					className={`${isProfile && "animate-pulse"}`}
				/>
				<div
					className="absolute flex items-center justify-center 
			rounded-full w-[20px] h-[20px] bg-white bg-opacity-75 bottom-[-3] left-9"
				>
					<Image
						src="/down-arrow.svg"
						alt="Arrow down Icon"
						width={10}
						height={10}
						className={`transition duration-300 ${
							isProfile ? "rotate-180" : "rotate-0"
						}`}
					/>
				</div>
			</button>
			{isProfile && (
				<div className="absolute right-0 z-10 top-18 w-50 divide-y divide-bbg origin-top-right rounded-lg bg-card border-2 border-br-card backdrop-blur-xs">
					<div className="mt-2 flex w-full items-center px-7 py-3 hover:cursor-pointer hover:bg-hbbg">
						<Image
							src="/profile-btn.svg"
							alt="Profile Icon"
							width={30}
							height={30}
						/>
						<span className="ml-5">Profile</span>
					</div>
					<div className="flex w-full items-center px-7 py-3 hover:cursor-pointer hover:bg-hbbg">
						<Image
							src="/setting-btn.svg"
							alt="Settings Icon"
							width={30}
							height={30}
						/>
						<span className="ml-5">Settings</span>
					</div>
					<div className="mb-2 w-full flex items-center px-7 py-3 hover:cursor-pointer hover:bg-hbbg">
						<Image
							src="/logout-btn.svg"
							alt="Logout Icon"
							width={30}
							height={30}
						/>
						<p className="ml-5">Logout</p>
					</div>
				</div>
			)}
		</div>
	);
}
