import { useBox } from "../contexts/boxContext";
import ChatFriend from "./ChatFriend";
import Image from "next/image";

export default function FriendsList() {
	const {
		showbox,
		setShowbox,
		isWidth,
		userMessage,
		setUserMessage,
		selectedFriend,
		setSelectedFriend,
	} = useBox();

	return (
		<section
			className={`${
				isWidth && showbox
					? "hidden"
					: "flex-2 flex max-w-full lg:min-w-[35%] lg:max-w-[40%] xl:lg:max-w-[30%] xl:lg:min-w-[20%]"
			}`}
		>
			<div className="flex w-full flex-col gap-5">
				<h1 className="px-5 py-10 text-3xl font-semibold lg:text-4xl">Chat</h1>
				<div className="relative w-full">
					<Image
						className="absolute left-4 top-3"
						src="/icons/user-search.svg"
						alt="Search User Icon"
						width={25}
						height={25}
					/>
					<input
						// ref={inputRef}
						className="bg-bg focus:ring-3 focus:ring-hbbg/50 border-br-card flex h-12
						w-full items-center rounded-full border-2 pl-12 pr-3 outline-none"
						type="text"
						autoComplete="off"
						placeholder="Start Searching..."
						// value={search}
						// onChange={(e) => {
						// 	setSearch(e.target.value);
						// }}
					/>
				</div>

				<div className="custom-scroll flex h-full flex-col gap-1 overflow-auto">
					{Array.from({ length: 100 }).map((_, i) => (
						<ChatFriend
							key={i}
							onClick={(e) => {
								e.preventDefault();
								setSelectedFriend(i);
								if (i === selectedFriend) setUserMessage(!userMessage);
								if (i !== selectedFriend) setUserMessage(true);
								if (isWidth) setShowbox(true);
							}}
							className={`${selectedFriend === i && userMessage && "bg-white/10"}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
