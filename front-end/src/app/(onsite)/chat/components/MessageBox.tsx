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
			className={`${
				isWidth && (showbox ? "block" : "hidden")
			} flex-5 bg-card border-br-card divide-white/15 divide-y-1 divide flex
						h-full w-full flex-col justify-between rounded-lg border-2`}
		>
			{userMessage ? (
				<>
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
									src="/image_1.jpg"
									width={100}
									height={100}
									alt="Profile Image"
								/>
							</div>
							<div className="flex w-full flex-col">
								<h2 className="text-lg lg:text-lg">
									<span className="hover:cursor-pointer">
										Azouz Nabil
									</span>
								</h2>
								<p className="text-sm text-gray-400">
									Last seen at 22:40
								</p>
							</div>
							<button
								className="w-25 bg-bbg hover:bg-white/2 hover:scale-101 h-[50%]
											rounded-lg transition-all duration-300
											hover:cursor-pointer hover:ring-2 hover:ring-white/10"
							>
								Block
							</button>
						</div>
					</div>
					<div className="custom-scroll flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-5 py-5">
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
								className="absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer"
								src="/send.svg"
								alt="Send Icon"
								width={20}
								height={20}
							/>
							<input
								className="flex h-full w-full items-center rounded-md bg-white/5 px-3 outline-none"
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
					<div className="flex h-full w-full select-none flex-col items-center justify-center">
						<Image
							src="/thinking.gif"
							width={300}
							height={30}
							alt="Thinking"
							className="mb-5 rounded-md"
						/>
						<div className="w-full text-center">
							<h2 className="text-lg">👋 Welcome to Chat!</h2>
							<p className="text-base text-gray-400">
								Select a user from the sidebar to start
								chatting.
							</p>
						</div>
					</div>
				</>
			)}
		</section>
	);
}
