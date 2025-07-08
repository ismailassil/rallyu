import Image from "next/image";
import types, { PushNotifProps } from "../types/Toaster.types";
import React, { useEffect, useState } from "react";

function ToasterItem({
	image = "/profile/darthVader.jpeg",
	username = "iassil",
	type = "chat",
}: PushNotifProps) {
	const [progress, setProgress] = useState(100);

	useEffect(() => {
		const TIME = 1.5 * 1000;
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
	}, []);

	return (
		<div
			className="w-90 h-18 shadow-xs shadow-main absolute
				flex items-center justify-between overflow-hidden rounded-lg bg-black/30
				px-4 ring-1 ring-white/10 backdrop-blur-lg"
		>
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
	);
}

export default ToasterItem;
