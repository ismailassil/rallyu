import { Sword } from "@phosphor-icons/react";
import Image from "next/image";

interface friendProps {
	fullname: string;
	isOnline?: boolean;
	img: string;
}

export default function BattleFriend({ fullname, isOnline = false, img }: friendProps) {
	if (fullname && fullname.trim().length > 12) fullname = fullname.trim().substring(0, 12) + "...";
	return (
		<div
			className="border-1 border-br-card hover:bg-hbg hover:border-hbbg hover:scale-101 min-h-16
				flex max-h-16 w-full cursor-pointer items-center
				justify-between overflow-hidden rounded-lg bg-black/10 p-2 px-3 transition-transform duration-200"
		>
			{/* Profile Image */}
			<div className="ml-1 flex h-[40px] w-[40px] justify-center rounded-full">
				<Image
					className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-base capitalize">{fullname}</h2>
				<p className={`${isOnline ? "text-isOnline" : "text-gray-500"} text-sm`}>
					{isOnline ? "Online" : "Offline"}
				</p>
			</div>

			{/* Buttons */}
			<div
				className="hover:bg-card flex h-10 w-10 cursor-pointer items-center justify-center
					rounded-full ring-1 ring-white/40 transition-all duration-300 hover:scale-105 hover:ring-2"
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
