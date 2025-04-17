"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar() {
	const pathname = usePathname();
	const router = useRouter();
	const [activeButton, setActiveButton] = useState<number>(-1);

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
		const currentLink = Links.find((link) => pathname.startsWith(link.path));
		setActiveButton(currentLink ? currentLink.id : -1);
	}, [Links, pathname]);

	return (
		<motion.nav
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-22 sm:mt-30 sm:translate-x-none bg-card border-br-card fixed bottom-0
				left-0 flex w-full flex-row
				items-center justify-center gap-10 overflow-clip border-t-2 sm:bottom-auto
				sm:left-auto sm:ml-6 sm:h-[calc(100vh-143px)] sm:w-20 sm:transform-none
				sm:flex-col sm:gap-16 sm:rounded-lg sm:border-2"
		>
			{Links.map((link) => (
				<button
					title={link.title}
					key={link.id}
					className={`relative flex
					h-[33px] w-[33px]
					items-center justify-center transition-transform duration-200 hover:cursor-pointer sm:h-[33px] sm:w-[33px]
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
						className={`absolute inset-0
							rounded-md
							transition-all duration-200
							${activeButton === link.id ? "scale-180 sm:scale-300 bg-hbbg" : "hover:bg-hbg hover:scale-150"}
								}
								`}
					></div>
				</button>
			))}
		</motion.nav>
	);
}
