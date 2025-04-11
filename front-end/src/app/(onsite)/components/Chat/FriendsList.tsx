import ChatFriend from "./ChatFriend";
import Image from "next/image";

interface FriendsListProps {
	userMessage: boolean;
	setUserMessage: (value: boolean) => void;
	isWidth: boolean;
	showbox: boolean;
	setShowbox: (value: boolean) => void;
	selectedFriend: number | null;
	setSelectedFriend: (value: number | null) => void;
}

export default function FriendsList({
	showbox,
	setShowbox,
	isWidth,
	userMessage,
	setUserMessage,
	selectedFriend,
	setSelectedFriend,
}: FriendsListProps) {
	return (
		<section
			className={`${isWidth && showbox ? "hidden" : "max-w-full lg:max-w-90 flex flex-2"}`}
		>
			<div className="w-full flex flex-col gap-5">
				<h1 className="text-4xl lg:text-5xl py-10 px-5">Chat</h1>
				<div className="relative w-full">
					<Image
						className="absolute left-4 top-3"
						src="/user-search.svg"
						alt="Search User Icon"
						width={25}
						height={25}
					/>
					<input
						// ref={inputRef}
						className="w-full flex items-center bg-bg border-2 focus:ring-3
						focus:ring-hbbg/50 border-br-card rounded-full h-12 pl-12 pr-3 outline-none"
						type="text"
						autoComplete="off"
						placeholder="Start Searching..."
						// value={search}
						// onChange={(e) => {
						// 	setSearch(e.target.value);
						// }}
					/>
				</div>

				<div className="flex flex-col gap-1 h-full overflow-auto">
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
