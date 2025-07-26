import { ArrowLeft, GameController } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";
import { useBox } from "../contexts/boxContext";

const MessageHeader = () => {
	const { setShowbox, isWidth, setSelectedFriend } = useBox();

	return (
		<div className="h-17 flex items-center px-6">
			<div className="flex h-full w-full items-center justify-between gap-5">
				<ArrowLeft
					size={40}
					className="hover:fill-accent block aspect-square hover:cursor-pointer lg:hidden"
					onClick={(e) => {
						e.preventDefault();
						if (isWidth) {
							setShowbox(false);
							setSelectedFriend(null);
						}
					}}
				/>
				<div className="flex aspect-square h-[38px] w-[38px] items-center justify-center rounded-full lg:h-[40px] lg:w-[40px]">
					<Image
						className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
						src="/profile/image_1.jpg"
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
				<div className="flex w-full flex-col">
					<h2 className="text-lg lg:text-lg">
						<span className="rounded-sm hover:cursor-pointer hover:bg-white/10">
							Azouz Nabil
						</span>
					</h2>
					<p className="text-sm text-gray-400">Last seen at 22:40</p>
				</div>
				<div className="inline-flex gap-2">
					<button
						className="bg-main hover:bg-white/2 hover:scale-101 rounded-lg px-4
									py-1 transition-all duration-300
									hover:cursor-pointer hover:ring-2 hover:ring-white/10"
					>
						<GameController size={24} />
					</button>
					<button
						className="bg-bbg hover:bg-white/2 hover:scale-101 rounded-lg px-4
									py-1 transition-all duration-300
									hover:cursor-pointer hover:ring-2 hover:ring-white/10"
					>
						Block
					</button>
				</div>
			</div>
		</div>
	);
};

export default MessageHeader;
