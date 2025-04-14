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
	if (name && name.trim().length > 20) name = name.trim().substring(0, 17) + "...";
	if (message && message.trim().length > 25)
		message = message.trim().substring(0, 25) + "...";
	return (
		<div className="px-2 py-4 w-full flex text-start min-h-16 gap-3 max-h-20 items-center">
			<div className="flex flex-1 gap-3 items-center">
				<div className="flex rounded-full overflow-hidden aspect-square max-h-8 min-h-8 min-w-8 max-w-8">
					<Image
						src={"/image_1.jpg"}
						alt="Profile Image"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>
				<div className="">
					<p className="font-semibold text-sm">{name}</p>
					<p className="text-xs">
						{type === "game" ? "🎮 Ready to play?" : message}
					</p>
				</div>
			</div>
			<div className="flex gap-2 justify-end">
				{type === "game" ? (
					<>
						<Check
							size={12}
							className="w-6 h-6 p-0.5 bg-main/70 rounded-xs cursor-pointer hover:scale-110 transform transition-all duration-300"
						/>
						<X
							size={12}
							className="w-6 h-6 p-0.5 bg-red-500/70 rounded-xs cursor-pointer hover:scale-110 transition-all duration-300"
						/>
					</>
				) : (
					<ArrowBendUpRight
						size={12}
						className="w-6 h-6 p-0.5 bg-card ring-1 ring-br-card hover:bg-white/10
								cursor-pointer rounded-lg hover:scale-110 transition-all duration-300"
					/>
				)}
			</div>
		</div>
	);
}

export default InnerNotification;
