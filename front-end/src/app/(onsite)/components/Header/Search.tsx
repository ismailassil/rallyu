import lora from "@/app/fonts/lora";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface SearchProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isSearch: boolean;
}

export default function Search({
	setIsNotif,
	setIsProfile,
	setIsSearch,
	isSearch,
}: SearchProps) {
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
				className="flex items-center md:bg-card md:h-[55px] md:w-[100px] rounded-full
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
				<div className="md:flex hidden">
					<Image src="/command.svg" alt="Command Logo" width={15} height={15} />
					<span className={`text-lg ${lora.className}`}>K</span>
				</div>
			</div>
			{isSearch && (
				<div
					className="fixed inset-0 z-50 flex
						pt-10 pb-5 pl-3 pr-3 md:p-20 md:10 lg:p-40 lg:pb-20
						w-full flex-col items-center backdrop-blur-2xl bg-black/20"
				>
					<div className="w-[100%] lg:w-[80%] h-full">
						<div ref={div1Ref} className="relative bg-white/10 rounded-lg">
							<Image
								className="absolute left-5 top-[19px] opacity-75"
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
							className="bg-white/10 w-full max-h-118 rounded-lg mt-3
						  	[&::-webkit-scrollbar]:w-2
  							[&::-webkit-scrollbar-track]:rounded-full
  							[&::-webkit-scrollbar-track]:bg-none
  							[&::-webkit-scrollbar-thumb]:rounded-full
  							[&::-webkit-scrollbar-thumb]:bg-gray-300/30
							overflow-auto"
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
				</div>
			)}
		</>
	);
}
