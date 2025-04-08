"use client";

import Image from "next/image";
import { useState } from "react";

export default function SideBar() {
	const [activeButton, setActiveButton] = useState<number>(0);

	const Links = [
		{ id: 0, title: "Home", src: "/Home.svg", path: "/dashboard", alt: "" },
		{ id: 1, title: "Game", src: "/Game.svg", path: "/game", alt: "" },
		{
			id: 2,
			title: "Tournament",
			src: "/Tournament.svg",
			path: "/tournament",
			alt: "",
		},
		{ id: 3, title: "Chat", src: "/Chat.svg", path: "/chat", alt: "" },
		{
			id: 4,
			title: "Settings",
			src: "/Settings.svg",
			path: "/settings",
			alt: "",
		},
	];

	return (
		<nav
			className="fixed flex flex-row justify-center items-center gap-10 w-full
				bottom-0 left-0 h-22 overflow-clip
				sm:flex-col sm:h-[calc(100vh-148px)] sm:gap-16 sm:ml-6 sm:w-24 sm:mt-30
				sm:bottom-auto sm:left-auto sm:transform-none sm:translate-x-none sm:rounded-lg
				bg-card sm:border-2 border-t-2 border-br-card"
		>
			{Links.map((link) => (
				<button
					title={link.title}
					key={link.id}
					className={`relative hover:cursor-pointer
					transition-transform duration-200
					w-[40px] h-[40px] flex items-center justify-center
					${link.id === activeButton ? "hover:scale-105" : "hover:scale-120"}
					`}
					onClick={() => setActiveButton(link.id)}
				>
					<Image
						src={link.src}
						width={40}
						height={40}
						alt={link.alt}
						className={`${activeButton === link.id && "scale-110"}`}
					/>
					<div
						className={`absolute rounded-lg
							inset-0
							transition-all duration-200
							${
								activeButton === link.id
									? "scale-180 sm:scale-300 bg-hbbg"
									: "hover:scale-150 hover:bg-hbg"
							}
								}
								`}
					></div>
				</button>
			))}
		</nav>
	);
}
