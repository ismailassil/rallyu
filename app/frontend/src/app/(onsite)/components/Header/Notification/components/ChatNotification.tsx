import { ArrowBendUpRight } from "@phosphor-icons/react";
import React from "react";

const ChatNotification = ({ message }: { message: string }) => {
	return (
		<div className="ml-10 flex gap-2">
			<div
				className="bg-card ring-br-card hover:scale-101 flex w-full cursor-pointer
			items-center justify-between gap-2 rounded-lg px-4 py-2
			text-xs ring-1 transition-all duration-300 hover:bg-white/10"
			>
				<p className="line-clamp-2 flex-1">{message}</p>
				<ArrowBendUpRight size={18} />
			</div>
		</div>
	);
};

export default ChatNotification;
