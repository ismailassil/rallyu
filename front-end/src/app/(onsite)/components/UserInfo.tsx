import unicaOne from "@/app/fonts/unicaOne";
import Image from "next/image";

export default function UserInfo() {
	return (
		<div className="grid grid-cols-[1fr_0.5fr] gap-10 w-full h-full items-center p-13 overflow-hidden">
			<div className="">
				<div className="relative group select-none">
					<h1 className={`${unicaOne.className} text-4xl mb-10`}>
						WELCOME BACK, <span className="text-accent">ISMAIL</span>
					</h1>
					<div
						className="absolute top-[calc(50%)] -left-17
					-translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-lg bg-accent
					duration-200 transition-all group-hover:scale-105"
					></div>
				</div>
				<p className="text-gray-400">Step into a World of Classy Gaming</p>
				<div className="mt-10">
					<p className="mb-2 pt-10">Level 10</p>
					<div className=" bg-notwhite w-[100%] h-2 rounded-full">
						<div className="bg-accent w-[60%] h-2 rounded-full"></div>
					</div>
				</div>
			</div>
			<div className="flex justify-center items-center mx-auto w-[250px] h-[250px] transition-transform duration-200 hover:scale-101">
				<Image
					className="ring-6 rounded-full ring-br-image object-cover w-full h-full hover:ring-7 transition-transform duration-200 hover:scale-101"
					src="/image.png"
					alt="Profile Image"
					width={250}
					height={250}
				/>
			</div>
		</div>
	);
}
