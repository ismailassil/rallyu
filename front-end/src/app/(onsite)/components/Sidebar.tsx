"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar() {
	const pathname = usePathname();
	const router = useRouter();
	const [activeButton, setActiveButton] = useState<number>(0);

	const Links = useMemo(
		() => [
			{
				id: 0,
				title: "Home",
				src: "/NavBar/Home.svg",
				path: "/dashboard",
				alt: "Dashboard Icon",
			},
			{
				id: 1,
				title: "Game",
				src: "/NavBar/Game.svg",
				path: "/game",
				alt: "Game Icon",
			},
			{
				id: 2,
				title: "Tournament",
				src: "/NavBar/Tournament.svg",
				path: "/tournament",
				alt: "Tournament Icon",
			},
			{
				id: 3,
				title: "Chat",
				src: "/NavBar/Chat.svg",
				path: "/chat",
				alt: "Chat Icon",
			},
			{
				id: 4,
				title: "Settings",
				src: "/NavBar/Settings.svg",
				path: "/settings",
				alt: "Settings Icon",
			},
		],
		[]
	);

	useEffect(() => {
		const currentLink = Links.find((link) => link.path === pathname);
		if (currentLink) setActiveButton(currentLink.id);
	}, [Links, pathname]);

	return (
		<motion.nav
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="fixed flex flex-row justify-center items-center gap-10 w-full
				bottom-0 left-0 h-22 overflow-clip
				sm:ml-6 sm:w-20 sm:mt-30 sm:flex-col sm:h-[calc(100vh-143px)] sm:gap-16
				sm:bottom-auto sm:left-auto sm:transform-none sm:translate-x-none sm:rounded-lg
				bg-card sm:border-2 border-t-2 border-br-card"
		>
			{Links.map((link) => (
				<button
					title={link.title}
					key={link.id}
					className={`relative hover:cursor-pointer
					transition-transform duration-200
					w-[40px] h-[40px] sm:w-[33px] sm:h-[33px] flex items-center justify-center
					${link.id === activeButton ? "hover:scale-105" : "hover:scale-120"}
					`}
					onClick={() => {
						router.push(link.path);
						setActiveButton(link.id);
					}}
				>
					<Image
						src={link.src}
						width={40}
						height={40}
						alt={link.alt}
						className={`${activeButton === link.id && "scale-120"}`}
					/>
					<div
						className={`absolute rounded-md
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
		</motion.nav>
	);
}
