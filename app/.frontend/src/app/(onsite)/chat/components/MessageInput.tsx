import { PaperPlaneRight } from "@phosphor-icons/react";
import React from "react";

const MessageInput = () => {
	return (
		<div className="h-18 flex flex-col justify-center p-3">
			<div className="relative h-full w-full">
				<PaperPlaneRight
					size={22}
					className="hover:scale-115 duration-400 absolute right-4
						top-1/2 -translate-y-1/2 cursor-pointer transition-all"
				/>
				<input
					className="flex h-full w-full items-center rounded-md bg-white/5 pl-3 
									pr-12 outline-none"
					autoComplete="off"
					type="text"
					placeholder="Enter your message"
					// showbox={search}
					// onChange={(e) => {
					// 	setSearch(e.target.showbox);
					// }}
				/>
			</div>
		</div>
	);
};

export default MessageInput;
