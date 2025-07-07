import { ArrowBendUpRight } from "@phosphor-icons/react";
import Image from "next/image";
import moment from "moment";

const game = "challenged you to a game!";

const friend_request = "sent you a friend request!";

function InnerNotification({
	name,
	message,
	type,
	date,
}: {
	name: string;
	message: string;
	type: "game" | "chat" | "friend_request";
	date: number;
}) {
	const textDescription = type === "game" ? game : friend_request;

	return (
		<div className={`min-h-16 flex w-full flex-col gap-3 px-2 py-4 text-start hover:bg-black/10`}>
			<div className="flex flex-1 select-none items-center gap-3">
				<div className="min-h-8 min-w-8 max-w-8 flex aspect-square max-h-8 overflow-hidden rounded-full">
					<Image
						src={"/profile/image_1.jpg"}
						alt="Profile Image"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>
				<div>
					<p className="text-sm font-light">
						<span className="font-semibold">{name}</span> {textDescription}
					</p>
					<p className="text-xs text-gray-400">
						{moment(date).format("MMMM Do YYYY | hh:mm")}
					</p>
					{/* <p className="line-clamp-1 text-xs">
						{type === "game" ? "🎮 Ready to play?" : message}
					</p> */}
				</div>
			</div>
			<div className="ml-10 flex gap-2">
				{type === "chat" ? (
					<div
						className="bg-card ring-br-card flex cursor-pointer items-center gap-2 rounded-lg px-4 py-0.5 text-sm 
								ring-1 transition-all duration-300 hover:scale-105 hover:bg-white/10"
					>
						<ArrowBendUpRight size={18} />
						Reply
					</div>
				) : (
					<>
						<p className="cursor-pointer rounded-lg px-3 py-0.5 text-sm ring-1 ring-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/10">
							Decline
						</p>
						<p className="hover:bg-main-hover bg-main cursor-pointer rounded-lg px-4 py-0.5 text-sm transition-all duration-300  hover:scale-105">
							Accept
						</p>
					</>
				)}
			</div>
		</div>
	);
}

export default InnerNotification;
