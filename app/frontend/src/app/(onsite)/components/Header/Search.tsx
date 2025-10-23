// import lora from "@/app/fonts/lora";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHeaderContext } from "./context/HeaderContext";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../../users/components/Avatar";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowFatUpIcon } from "@phosphor-icons/react";

interface SearchByUsernameResult {
	id: number;
	username: string;
	avatar_url: string;
}

export default function Search() {
	const { apiClient } = useAuth();
	const [search, setSearch] = useState<string>("");
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const t = useTranslations('header.search');

	const [results, setResults] = useState<SearchByUsernameResult[]>([]);

	const { setIsNotif, setIsProfile, isSearch, setIsSearch } = useHeaderContext();

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function handleClick(event: MouseEvent | KeyboardEvent) {
			if (
				event instanceof KeyboardEvent &&
				(event.key === "Escape" || (event.metaKey && event.key === "k" && event.shiftKey))
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

	useEffect(() => {
		if (search === "") {
			setResults([]);
			return;
		}

		async function fetchUsersByQuery() {
			try {
				const data = await apiClient.user.searchUsersByQuery(search);
				setResults(data);
			} catch {
				setResults([]);
			}
		}

		fetchUsersByQuery();
	}, [apiClient.user, search]);

	return (
		<>
			{/* <SearchButton /> */}
			<div
				className="md:bg-card flex items-center justify-center rounded-full pr-1 transition-all duration-200 hover:scale-102 hover:cursor-pointer hover:ring-1 hover:ring-white/30 md:h-[55px] md:w-[100px]"
				onClick={() => {
					setIsNotif(false);
					setIsProfile(false);
					setIsSearch(!isSearch);
				}}
			>
				<Image
					className="mr-2"
					src="/icons/search.svg"
					alt="Search Logo"
					width={20}
					height={20}
				/>
				<div className="hidden md:flex items-center">
					<Image src="/icons/command.svg" alt="Command Logo" width={15} height={15} />
					<ArrowFatUpIcon size={18} />
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
						className="fixed inset-0 z-50 flex w-full h-screen flex-col items-center pt-10 pr-3 pb-5 pl-3 backdrop-blur-md md:p-20 lg:p-40 lg:pb-20"
					>
						<div className="h-full w-[100%] max-w-220 lg:w-[80%]">
							<div
								ref={div1Ref}
								className="border-br-card relative rounded-lg border-2 bg-white/10"
							>
								<Image
									className="absolute top-[19px] left-5 opacity-75"
									src="/icons/search.svg"
									alt="Search Logo"
									width={0}
									height={0}
									style={{ width: "auto", height: "auto" }}
								/>
								<input
									ref={inputRef}
									type="text"
									className="focus:ring-main/80 h-16 w-full rounded-md pr-20 pl-16 outline-none focus:ring-2"
									autoComplete="off"
									placeholder={t("placeholder")}
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
									}}
								/>
								<p
									onClick={() => setSearch("")}
									className="hover:text-main-ring-hover/70 absolute top-[19px] right-6 hover:cursor-pointer hover:underline"
								>
									{t("clear")}
								</p>
							</div>
							<div
								ref={div2Ref}
								className="border-br-card custom-scroll mt-3 h-full max-h-118 min-h-90 w-full overflow-auto rounded-lg border-2 bg-white/10"
							>
								<ul>
									{results.map((elem) => {
										return (
												<Link
													href={`/users/${elem.username}`}
													onClick={() => {setIsSearch(false); setSearch("");}}
													key={elem.username}
													className="w-full h-17 flex items-center gap-4 border-b-1
														border-b-br-card pl-10 hover:bg-hbg/30 hover:cursor-pointer
														"
												>
													<Avatar
														avatar={elem.avatar_url}
														className="rounded-full h-10 w-10 border-2 border-white/20"
													/>
													{/* <Image src={`http://localhost:4025/api${elem.avatar_url}`} alt="Command Logo" width={42} height={42} className="rounded-full border-2 border-white/20"/> */}
													<p>{elem.username}</p>
												</Link>
										);
									})}
								</ul>
								{!results.length && (
									<div className="flex h-full w-full flex-col items-center justify-center gap-3">
										<Image
											src="/meme/sad.png"
											height={12}
											width={120}
											alt="Sad Image"
										/>
										<p className="text-gray-400">{t("ide")}</p>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
