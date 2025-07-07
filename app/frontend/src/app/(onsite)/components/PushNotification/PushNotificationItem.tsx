import { X } from "@phosphor-icons/react";
import Image from "next/image";
import types from "./types";
import React, { useEffect } from "react";

interface Props {
	id: string;
	image: string;
	username: string;
	type: "game" | "friend_request" | "chat";
	onClose: () => void;
}

function PushNotificationItem({
	id,
	image = "/profile/darthVader.jpeg",
	username = "iassil",
	type = "chat",
	onClose,
}: Props) {
	useEffect(() => {
		const TIME = 5 * 1000; // 5 Seconds
		const start = Date.now();
		const timer = setInterval(() => {
			const remaining = Date.now() - start;
			if (remaining >= TIME) {
				clearInterval(timer);
				onClose();
			}
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, [onClose]);

	return (
		<div
			className="w-90 h-18 shadow-xs shadow-main absolute
				flex items-center justify-between overflow-hidden rounded-lg bg-black/30
				px-4 ring-1 ring-white/10 backdrop-blur-lg"
		>
			<div className="relative flex select-none items-center gap-5">
				<div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/30">
					<Image
						src={image}
						alt="Profile Icon"
						className="object-cover"
						width={90}
						height={90}
					/>
				</div>
				<div>
					<p className="font-bold">{username}</p>
					<p className="text-sm">{types[type].title}</p>
				</div>
			</div>
			<div className="cursor-pointer rounded-full hover:bg-white/5">
				<X
					size={24}
					className="hover:scale-120 duration-350 fill-white/30
						transition-all hover:fill-white/70"
					onClick={onClose}
				/>
			</div>
			{types[type].icon}
		</div>
	);
}

export default PushNotificationItem;
