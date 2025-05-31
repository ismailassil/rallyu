"use client"
import { useState } from "react"
import Image from "next/image"
import { Check, X } from "@phosphor-icons/react";
import NotificationButton from "./components/NotificationButton";
import ProfileButton from "./components/ProfileButton";
import SearchButton from "./components/SearchButton";

const NavBar = () => {
	
	return (
		<nav className="p-6 flex justify-between">
			<Image width={138} height={38} src="/logo/rallyu-logo.svg" alt="notification image" />
			<div className="flex justify-end gap-4 hover:cursor-pointer ">

				<SearchButton />
				<NotificationButton />
				<ProfileButton />
			</div>
		</nav>
	)
}

export default  NavBar