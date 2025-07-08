import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle } from "@phosphor-icons/react";

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
	const router = useRouter();

	return (
		<div className="relative" ref={profileRef}>
			<button
				className={`bg-card border-br-card relative ml-4 flex h-[55px]
			w-[55px] items-center justify-center rounded-full border-2 hover:cursor-pointer
			${
				isProfile
					? "bg-hbg border-hbbg ring-bbg 			scale-101 ring-4"
					: "hover:bg-hbg hover:border-hbbg hover:ring-bbg 			hover:scale-101 hover:ring-4"
			} transition-transform duration-200
			
			`}
				onClick={() => {
					setIsNotif(false);
					setIsSearch(false);
					setIsProfile(!isProfile);
				}}
			>
				<UserCircle size={32} className={`${isProfile && "animate-pulse"}`} />
				<div
					className="absolute bottom-[-3] left-9 flex 
			h-[20px] w-[20px] items-center justify-center rounded-full bg-white bg-opacity-75"
				>
					<Image
						src="/icons/down-arrow.svg"
						alt="Arrow down Icon"
						width={10}
						height={10}
						className={`transition duration-300 ${isProfile ? "rotate-180" : "rotate-0"}`}
					/>
				</div>
			</button>
			<AnimatePresence>
				{isProfile && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							type: "spring",
							stiffness: 60,
							duration: 0.1,
						}}
						className="top-18 w-50 divide-bbg bg-card border-br-card absolute right-0 z-10 origin-top-right divide-y rounded-lg border-2 backdrop-blur-3xl"
					>
						<div
							onClick={(e) => {
								e.preventDefault();
								setIsProfile(!isProfile);
								router.push("/me");
							}}
							className="hover:bg-hbbg mt-2 flex w-full items-center px-7 py-3 hover:cursor-pointer"
						>
							<Image
								src="/icons/profile-btn.svg"
								alt="Profile Icon"
								width={30}
								height={30}
							/>
							<span className="ml-5">Profile</span>
						</div>
						<div
							className="hover:bg-hbbg flex w-full items-center px-7 py-3 hover:cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								setIsProfile(!isProfile);
								router.push("/settings");
							}}
						>
							<Image
								src="/icons/setting-btn.svg"
								alt="Settings Icon"
								width={30}
								height={30}
							/>
							<span className="ml-5">Settings</span>
						</div>
						<div className="hover:bg-hbbg mb-2 flex w-full items-center px-7 py-3 hover:cursor-pointer">
							<Image
								src="/icons/logout-btn.svg"
								alt="Logout Icon"
								width={30}
								height={30}
							/>
							<p className="ml-5">Logout</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
