// import lora from "@/app/fonts/lora";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isSearch: boolean;
}

export default function Search({ setIsNotif, setIsProfile, setIsSearch, isSearch }: SearchProps) {
	const [search, setSearch] = useState<string>("");
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function handleClick(event: MouseEvent | KeyboardEvent) {
			if (
				event instanceof KeyboardEvent &&
				(event.key === "Escape" || (event.metaKey && event.key === "k"))
			) {
				if (event.key === "Escape" && !isSearch) return;
				setIsSearch(!isSearch);
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
				setIsSearch(!isSearch);
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
	}, [isSearch, setIsSearch]);

	return (
		<>
			{/* <SearchButton /> */}
			<div
				className="md:bg-card flex items-center justify-center rounded-full pr-1
				transition-all duration-200 hover:scale-102 hover:cursor-pointer hover:ring-1
				hover:ring-white/30 md:h-[55px] md:w-[100px]
				"
				onClick={() => {
					setIsNotif(false);
					setIsProfile(false);
					setIsSearch(!isSearch);
				}}
			>
				<Image className="mr-2" src="/icons/search.svg" alt="Search Logo" width={20} height={20} />
				<div className="hidden md:flex">
					<Image src="/icons/command.svg" alt="Command Logo" width={15} height={15} />
					<span className={`text-lg`}>K</span>
				</div>
			</div>
			<AnimatePresence>
				{isSearch && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						exit={{ opacity: 0 }}
						className="md:10 fixed inset-0 z-50
					flex w-full flex-col items-center bg-black/60 pb-5 pl-3 pr-3
					pt-10 backdrop-blur-2xl md:p-20 lg:p-40 lg:pb-20"
					>
						<div className="max-w-220 h-full w-[100%] lg:w-[80%]">
							<div
								ref={div1Ref}
								className="border-br-card relative rounded-lg border-2 bg-white/10"
							>
								<Image
									className="absolute left-5 top-[19px] opacity-75"
									src="/icons/search.svg"
									alt="Search Logo"
									width={0}
									height={0}
									style={{ width: "auto", height: "auto" }}
								/>
								<input
									ref={inputRef}
									type="text"
									className="focus:ring-main/80 h-16 w-full rounded-md pl-16 pr-20 outline-none focus:ring-2"
									autoComplete="off"
									placeholder="Start Searching..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
									}}
								/>
								<p
									onClick={() => setSearch("")}
									className="hover:text-main-ring-hover/70 absolute right-6 top-[19px] hover:cursor-pointer hover:underline"
								>
									Clear
								</p>
							</div>
							<div
								ref={div2Ref}
								className="min-h-90 max-h-118 border-br-card custom-scroll
									mt-3 h-full w-full overflow-auto rounded-lg border-2 bg-white/10"
							>
								{/* {Array.from({ length: 10 }).map((_, i) => (
								<div
									key={i}
									className="w-full h-17 flex items-center border-b-1
										border-b-br-card pl-10 hover:bg-hbg/30 hover:cursor-pointer"
									>
									Person
									</div>
							))} */}
								<div className="flex h-full w-full flex-col items-center justify-center gap-3">
									<Image src="/meme/sad.png" height={12} width={120} alt="Sad Image" />
									<p className="text-gray-400">Help yourself...</p>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
