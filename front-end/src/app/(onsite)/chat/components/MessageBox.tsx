import { Fragment } from "react";
import Message from "./Message";
import Image from "next/image";
import { ArrowLeft } from "@phosphor-icons/react";
import { useBox } from "../contexts/boxContext";

export default function MessageSection() {
	const { showbox, setShowbox, isWidth, userMessage, setSelectedFriend } =
		useBox();

	return (
		<section
			className={`${isWidth && (showbox ? "block" : "hidden")} flex-5 h-full w-full bg-card border-2 border-br-card rounded-lg
						divide-white/15 divide-y-1 divide flex flex-col justify-between`}
		>
			{userMessage ? (
				<>
					<div className="h-20 flex items-center px-6">
						<div className="flex w-full h-full items-center justify-between gap-5">
							<ArrowLeft
								size={40}
								className="block lg:hidden aspect-square hover:cursor-pointer hover:fill-accent"
								onClick={(e) => {
									e.preventDefault();
									if (isWidth) {
										setShowbox(false);
										setSelectedFriend(null);
									}
								}}
							/>
							<div className="flex w-[40px] h-[40px] lg:w-[43px] lg:h-[43px] rounded-full justify-center aspect-square items-center">
								<Image
									className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
									src="/image_1.jpg"
									width={100}
									height={100}
									alt="Profile Image"
								/>
							</div>
							<div className="flex flex-col w-full">
								<h2 className="text-lg lg:text-lg">
									<span className="hover:cursor-pointer">Azouz Nabil</span>
								</h2>
								<p className="text-sm text-gray-400">Last seen at 22:40</p>
							</div>
							<button
								className="w-25 h-[50%] rounded-lg bg-bbg hover:bg-white/2
											hover:ring-2 hover:ring-white/10 hover:cursor-pointer
											hover:scale-101 transition-all duration-300"
							>
								Block
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col-reverse gap-2 custom-scroll">
						{Array.from({ length: 20 }).map((_, i) => (
							<Fragment key={i}>
								<Message
									username="Azouz Nabil"
									date="Tuesday, 12:21"
									message="Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois?"
								/>
								<Message
									username="Me"
									date="Tuesday, 13:21"
									message="Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois?"
								/>
							</Fragment>
						))}
					</div>
					<div className="h-18 flex flex-col justify-center p-3">
						<div className="relative h-full w-full">
							<Image
								className="absolute top-1/2 -translate-y-1/2 right-3 hover:cursor-pointer"
								src="/send.svg"
								alt="Send Icon"
								width={20}
								height={20}
							/>
							<input
								className="bg-white/5 rounded-md h-full w-full flex items-center px-3 outline-none"
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
				</>
			) : (
				<>
					<div className="h-full w-full flex flex-col items-center justify-center select-none">
						<Image
							src="/thinking.gif"
							width={300}
							height={30}
							alt="Thinking"
							className="rounded-md mb-5"
						/>
						<div className="w-full text-center">
							<h2 className="text-lg">👋 Welcome to Chat!</h2>
							<p className="text-base text-gray-400">
								Select a user from the sidebar to start chatting.
							</p>
						</div>
					</div>
				</>
			)}
		</section>
	);
}
