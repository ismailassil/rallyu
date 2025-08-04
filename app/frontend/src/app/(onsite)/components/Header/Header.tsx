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
			className={`fixed top-0 left-0 z-200 flex h-25 w-full items-center justify-between p-6 ${setScrolled && "backdrop-blur-2xl"}`}
		>
			<Image
				src={!Logo ? "/logo/rallyu-logo.svg" : "/logo/rallyu-jp.svg"}
				alt="Logo"
				width={138}
				height={38}
				priority={true}
				className={
					Logo
						? "scale-105 cursor-pointer pl-6 transition-transform duration-200"
						: "scale-100 cursor-pointer pl-6 transition-transform duration-200"
				}
				onClick={() => setLogo(!Logo)}
			/>
			<HeaderItems />
		</motion.header>
	);
}
