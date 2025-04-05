import Image from "next/image";
import { useState } from "react";

export default function SideBar() {
	const [activeButton, setActiveButton] = useState<number>(0);

	const Links = [
		{ id: 0, src: "/Home.svg", path: "/dashboard", alt: "" },
		{ id: 1, src: "/Game.svg", path: "/game", alt: "" },
		{ id: 2, src: "/Tournament.svg", path: "/tournament", alt: "" },
		{ id: 3, src: "/Chat.svg", path: "/chat", alt: "" },
		{ id: 4, src: "/Settings.svg", path: "/settings", alt: "" },
	];

	return (
		<>
			{Links.map((link) => (
				<button
					key={link.id}
					className={`relative hover:cursor-pointer
						animation-transform duration-200
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
									? "scale-300 bg-hbbg"
									: "hover:scale-150 hover:bg-hbg"
							}
						}
							`}
					></div>
				</button>
			))}
		</>
	);
}
