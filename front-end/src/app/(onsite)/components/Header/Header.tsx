"use client";

import Image from "next/image";
import HeaderItems from "./HeaderItems";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
	const [setScrolled, setSetScrolled] = useState(false);
	const [Logo, setLogo] = useState(false);

	useEffect(() => {
		function handleScroll() {
			setSetScrolled(window.scrollY > 1);
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<motion.header
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1 }}
			className={`flex fixed w-full top-0 left-0 z-200 justify-between p-6 items-center h-25
				${setScrolled && "backdrop-blur-2xl"}`}
		>
			<Image
				src={!Logo ? "/rallyu-logo.svg" : "/rallyu-jp.svg"}
				alt="Logo"
				width={138}
				height={38}
				priority={true}
				className={
					Logo
						? "cursor-pointer pl-6 scale-105 transition-transform duration-200"
						: "cursor-pointer pl-6 scale-100 transition-transform duration-200"
				}
				onClick={() => setLogo(!Logo)}
			></Image>
			<HeaderItems />
		</motion.header>
	);
}
