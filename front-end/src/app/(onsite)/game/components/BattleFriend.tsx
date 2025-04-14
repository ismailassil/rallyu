import { Sword } from "@phosphor-icons/react";
import Image from "next/image";

interface friendProps {
	fullname: string;
	isOnline?: boolean;
	img: string;
}

export default function BattleFriend({
	fullname,
	isOnline = false,
	img,
}: friendProps) {
	if (fullname && fullname.trim().length > 12)
		fullname = fullname.trim().substring(0, 12) + "...";
	return (
		<div
			className="flex justify-between bg-black/10 border-1 border-br-card rounded-lg
				hover:bg-hbg hover:border-hbbg hover:scale-101 transition-transform duration-200
				p-2 px-3 items-center overflow-hidden w-full min-h-16 max-h-16 cursor-pointer"
		>
			{/* Profile Image */}
			<div className="ml-1 flex w-[40px] h-[40px] rounded-full justify-center">
				<Image
					className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-base capitalize">{fullname}</h2>
				<p
					className={`${isOnline ? "text-isOnline" : "text-gray-500"} text-sm`}
				>
					{isOnline ? "Online" : "Offline"}
				</p>
			</div>

			{/* Buttons */}
			<div
				className="flex w-10 h-10 rounded-full hover:bg-card items-center justify-center
					cursor-pointer ring-1 hover:ring-2 ring-white/40 hover:scale-105 transition-all duration-300"
			>
				<Sword size={24} />
				{/* <Image
					className="hover:ring-2 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/chat-btn.svg"
					width={50}
					height={50}
					alt="Chat Button Logo"
				/> */}
				{/* <Image
					className="hover:ring-3 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/enter-btn.svg"
					width={50}
					height={50}
					alt="Enter Button Logo"
				/> */}
			</div>
		</div>
	);
}
