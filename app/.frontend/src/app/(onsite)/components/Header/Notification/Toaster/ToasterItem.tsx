import Image from "next/image";
import types, { PushNotifProps } from "../types/Toaster.types";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ToasterItem({
	image = "/profile/darthVader.jpeg",
	username = "iassil",
	type = "chat",
	time: DEFAULT_TIME,
	action_url,
}: PushNotifProps) {
	const [progress, setProgress] = useState(100);
	const router = useRouter();

	useEffect(() => {
		const TIME = DEFAULT_TIME;
		const start = Date.now();
		const timer = setInterval(() => {
			const remaining = Date.now() - start;
			const percentage = Math.max(0, 100 - (remaining / TIME) * 100);
			setProgress(percentage);
			if (remaining >= TIME) {
				clearInterval(timer);
			}
		}, 100);

		return () => {
			clearInterval(timer);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleAccept() {
		router.push(action_url);
	}

	return (
		<div
			className="absolute w-90
				flex flex-col items-between justify-center overflow-hidden rounded-lg bg-black/30
				ring-1 ring-white/15 backdrop-blur-lg"
		>
			<div className="h-18 px-4 flex items-center justify-between">
				<div
					className="bg-main absolute left-0 top-0 h-0.5 w-full transition-all"
					style={{ width: `${progress}%` }}
				/>
				<div className="relative flex select-none items-center gap-5">
					<div className="flex h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/30">
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
				{types[type].icon}
			</div>
			{type !== 'chat' ? (
			<div className="h-8 flex justify-between text-sm divide-x divide-white/20 
					border-t-white/20 border-t-1 *:cursor-pointer *:transition-color *:duration-400">
				<button className="w-full hover:bg-main" onClick={handleAccept}>Accept</button>
				<button className="w-full hover:bg-red-600">Decline</button>
			</div> )
			: (
				<button className="w-full h-8 hover:bg-white/10 flex items-center justify-center 
				text-sm divide-x divide-white/20 border-t-white/20 border-t-1
				cursor-pointer transition-color duration-400" onClick={handleAccept}>
						Reply
				</button>
			)}
		</div>
	);
}

export default ToasterItem;
