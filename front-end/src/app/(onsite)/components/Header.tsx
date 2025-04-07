"use client";

import Image from "next/image";
import UserMenu from "./UserMenu";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
	const [setScrolled, setSetScrolled] = useState(false);

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
		<header
			className={`flex fixed w-full top-0 left-0 z-200 justify-between p-6 items-center h-25
		${setScrolled && "backdrop-blur-2xl"}`}
		>
			<Link href="/dashboard">
				<Image
					src="/rallyu-logo.svg"
					alt="Logo"
					width={138}
					height={38}
					priority={true}
					className="hover:cursor-pointer pl-6 hover:scale-105
					transition-transform duration-200"
				></Image>
			</Link>
			<UserMenu />
		</header>
	);
}
