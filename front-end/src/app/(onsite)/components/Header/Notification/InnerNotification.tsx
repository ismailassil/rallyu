import { ArrowBendUpRight, Check, X } from "@phosphor-icons/react";
import Image from "next/image";

function InnerNotification({
	name,
	message,
	type,
}: {
	name: string;
	message: string;
	type: "game" | "msg";
}) {
	if (name && name.trim().length > 20)
		name = name.trim().substring(0, 17) + "...";
	if (message && message.trim().length > 25)
		message = message.trim().substring(0, 25) + "...";
	return (
		<div className="min-h-16 flex max-h-20 w-full items-center gap-3 px-2 py-4 text-start">
			<div className="flex flex-1 items-center gap-3">
				<div className="min-h-8 min-w-8 max-w-8 flex aspect-square max-h-8 overflow-hidden rounded-full">
					<Image
						src={"/image_1.jpg"}
						alt="Profile Image"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>
				<div className="">
					<p className="text-sm font-semibold">{name}</p>
					<p className="text-xs">
						{type === "game" ? "🎮 Ready to play?" : message}
					</p>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				{type === "game" ? (
					<>
						<Check
							size={12}
							className="bg-main/70 rounded-xs h-6 w-6 transform cursor-pointer p-0.5 transition-all duration-300 hover:scale-110"
						/>
						<X
							size={12}
							className="rounded-xs h-6 w-6 cursor-pointer bg-red-500/70 p-0.5 transition-all duration-300 hover:scale-110"
						/>
					</>
				) : (
					<ArrowBendUpRight
						size={12}
						className="bg-card ring-br-card h-6 w-6 cursor-pointer rounded-lg p-0.5
								ring-1 transition-all duration-300 hover:scale-110 hover:bg-white/10"
					/>
				)}
			</div>
		</div>
	);
}

export default InnerNotification;
