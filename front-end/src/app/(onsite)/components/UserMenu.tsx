import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import lora from "@/app/fonts/lora";

export default function UserMenu() {
	const [isProfile, setIsProfile] = useState(false);
	const [isNotif, setIsNotif] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const [search, setSearch] = useState<string>("");
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const profileRef = useRef<HTMLDivElement>(null);
	const notificationRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(event: MouseEvent | KeyboardEvent) {
			if (
				event instanceof KeyboardEvent &&
				(event.key === "Escape" || (event.metaKey && event.key === "k"))
			) {
				if (event.key === "Escape" && !isSearch) return;
				setIsSearch((isSearch) => !isSearch);
				setSearch("");
				return;
			}
			if (
				event instanceof MouseEvent &&
				div1Ref.current &&
				div2Ref.current &&
				!div1Ref.current.contains(event.target as Node) &&
				!div2Ref.current.contains(event.target as Node)
			) {
				setIsSearch((isSearch) => !isSearch);
				setSearch("");
			}
		}

		if (isSearch) {
			document.addEventListener("mousedown", handleClick);
			document.addEventListener("keydown", handleClick);
			inputRef.current?.focus();
		} else document.addEventListener("keydown", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleClick);
		};
	}, [isSearch]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node)
			) {
				setIsNotif((isNotif) => !isNotif);
			}
		}

		if (isNotif) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isNotif]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event instanceof MouseEvent &&
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setIsProfile((isProfile) => !isProfile);
			}
		}

		if (isProfile) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [isProfile]);

	return (
		<div className="relative flex items-center pr-6">
			{/* <SearchBar /> */}
			<div
				className="flex items-center bg-card h-[55px] w-[100px] rounded-full
			justify-center pr-1 hover:cursor-pointer hover:ring-2 hover:ring-white/30
			duration-200 transition-transform hover:scale-105
			"
				onClick={() => {
					setIsNotif(false);
					setIsProfile(false);
					setIsSearch(!isSearch);
				}}
			>
				<Image
					className="mr-2"
					src="/search.svg"
					alt="Search Logo"
					width={20}
					height={20}
				/>
				<Image src="/command.svg" alt="Command Logo" width={15} height={15} />
				<span className={`text-lg ${lora.className}`}>K</span>
			</div>
			{isSearch && (
				<div className="fixed inset-0 z-50 flex p-60 flex-col items-center backdrop-blur-lg bg-black/20">
					<div
						ref={div1Ref}
						className="overflow-scroll relative bg-white/10 w-[90%] max-w-2xl rounded-lg"
					>
						<Image
							className="absolute left-5 top-[18px] opacity-75"
							src="/search.svg"
							alt="Search Logo"
							width={0}
							height={0}
							style={{ width: "auto", height: "auto" }}
						/>
						<input
							ref={inputRef}
							type="text"
							className="w-full h-16 rounded-t-lg pl-16 pr-20 outline-none"
							autoComplete="off"
							placeholder="Start Searching..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
							}}
						/>
						<p
							onClick={() => setSearch("")}
							className="absolute right-6 top-[19px] hover:underline hover:text-main-ring-hover/70 hover:cursor-pointer"
						>
							Clear
						</p>
					</div>
					<div
						ref={div2Ref}
						className="bg-white/10 w-[90%] max-w-2xl max-h-118 rounded-lg mt-3 overflow-scroll"
					>
						{Array.from({ length: 10 }).map((_, i) => (
							<div
								key={i}
								className="w-full h-17 flex items-center border-b-1 border-b-br-card pl-10 hover:bg-hbg/30 hover:cursor-pointer"
							>
								Person
							</div>
						))}
					</div>
				</div>
			)}
			{/* NOTIFICATION ICON */}
			<div className="relative" ref={notificationRef}>
				<button
					className={`ml-4 rounded-full bg-card border-2 hover:cursor-pointer
					border-br-card w-[55px] h-[55px] flex justify-center items-center
					${
						isNotif
							? "bg-hbg border-hbbg ring-4 \
						ring-bbg scale-101"
							: "hover:bg-hbg hover:border-hbbg hover:ring-4 \
						hover:ring-bbg hover:scale-101"
					} transition-transform duration-200
						
						`}
					onClick={() => {
						setIsProfile(false);
						setIsSearch(false);
						setIsNotif(!isNotif);
					}}
				>
					<Image
						src="/notification.svg"
						alt="Notification Icon"
						width={0}
						height={0}
						style={{ width: "auto", height: "auto" }}
						className={`${isNotif && "animate-pulse"}`}
					/>
				</button>
				{isNotif && (
					<div
						className="absolute right-0 z-10 max-h-[348px] top-18 w-70 divide-y divide-bbg
					origin-top-right rounded-lg bg-card border-2 border-br-card
					backdrop-blur-lg overflow-scroll"
					>
						<div className="px-7 py-4 w-full flex sticky top-0 z-20 bg-card/70 backdrop-blur-3xl text-start justify-between items-center">
							<p>Notification</p>
							<div className="w-1 h-1 p-4 text-center flex items-center justify-center rounded-full bg-hbbg">
								0
							</div>
						</div>
						{Array.from({ length: 1 }).map((_, i) => (
							<p key={i} className="px-7 py-4 w-full flex text-start h-14">
								Nothing &#129488;
							</p>
						))}
					</div>
				)}
			</div>
			{/* PROFILE ICON */}
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
		</div>
	);
}
