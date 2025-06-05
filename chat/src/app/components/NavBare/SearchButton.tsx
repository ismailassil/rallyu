"use client"
import { useState } from "react"
import Image from "next/image"
import { Check, X } from "@phosphor-icons/react";

const SearchButton = () => {
	const [searchIcon, setSearchIcon] = useState(false)

  return (
    <div className="flex  backdrop-blur-sm bg-white/10 rounded-full p-4" onClick={() => setSearchIcon((prev) => !prev)}>
					<Image width={20} height={20} src="/icons/search.svg" alt="search image"
						className="" />
					<Image width={16} height={16} src="/icons/command.svg" alt="command image"
						className="ml-2 " />
					<span className="text-lg">K</span>
				</div>
  )
}

export default SearchButton