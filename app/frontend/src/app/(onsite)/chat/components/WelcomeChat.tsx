import Image from "next/image";
import React from "react";

const WelcomeChat = () => {
	return (
		<div className="flex h-full w-full select-none flex-col items-center justify-center">
			<Image
				src="/meme/thinking.gif"
				width={300}
				height={30}
				alt="Thinking"
				className="mb-5 rounded-md"
				unoptimized
			/>
			<div className="w-full text-center">
				<h2 className="text-lg">👋 Welcome to Chat!</h2>
				<p className="text-base text-gray-400">
					Select a user from the sidebar to start chatting.
				</p>
			</div>
		</div>
	);
};

export default WelcomeChat;
