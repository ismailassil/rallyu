"use client";

import unicaOne from "@/app/fonts/unicaOne";
import Image from "next/image";

function UserPanel() {
	return (
		<header
			className="flex w-full h-full gap-7
						flex-col lg:flex-row
						items-center p-12 pl-12 overflow-hidden
						min-h-[350px] sm:min-h-[330px] md:min-h-[400px]
						max-h-[400px] md:max-h-[300px]
						bg-card border-2 border-br-card rounded-lg"
		>
			<div className="flex-5 flex flex-col h-full justify-between items-center w-full">
				<div className="flex-1 flex items-center w-full h-full">
					<div className="flex-5 h-full py-5">
						<h1 className={`text-4xl lg:text-5xl ${unicaOne.className}`}>
							{new Date().getHours() < 17 ? "Good Morning" : "Good Evening"},
							<span className="text-accent font-semibold">
								{" "}
								<br />
								ISMAIL ASSIL
							</span>
						</h1>
						<p className="pt-5 text-gray-500 text-sm lg:text-lg">
							Step into a World of Classy Gaming
						</p>
					</div>
					<div className="flex-3 h-full flex justify-center items-center">
						<div
							className="flex h-[80%] justify-center aspect-square items-center
								ring-white/10 ring-5 rounded-full overflow-hidden
								hover:scale-105 transition-all duration-500 hover:ring-6 hover:ring-white/30
								"
						>
							<Image
								className={`w-full h-full object-cover`}
								src={"/image.png"}
								width={100}
								height={100}
								quality={100}
								alt="Profile Image"
							/>
						</div>
					</div>
				</div>
				<div className="h-[16%] w-full flex flex-col justify-end">
					<div>
						<div className="h-full flex flex-col gap-1">
							<div className="flex justify-between">
								<p className="font-semibold">Level 10</p>
								<p className="text-gray-600">60%</p>
							</div>
							<div className="w-full h-full">
								<div className="w-full bg-card h-2 rounded-full">
									<div className="bg-accent w-[60%] h-2 rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`w-full lg:w-[25%] h-full flex flex-row lg:flex-col gap-4 uppercase *:hover:scale-102 *:duration-200 *:transform ${unicaOne.className}`}
			>
				<div className="flex-1 bg-inner-card border-2 border-br-card rounded-2xl flex p-4 justify-between px-4 items-end">
					<p className="text-lg lg:text-2xl">Wins</p>
					<p className="text-3xl lg:text-4xl">50</p>
				</div>
				<div className="flex-1 bg-inner-card border-2 border-br-card rounded-2xl flex p-4 justify-between px-4 items-end">
					<p className="text-lg lg:text-2xl">Defeats</p>
					<p className="text-3xl lg:text-4xl">9</p>
				</div>
				<div className="flex-1 bg-inner-card border-2 border-br-card rounded-2xl flex p-4 justify-between px-4 items-end">
					<p className="text-lg lg:text-2xl">Draws</p>
					<p className="text-3xl lg:text-4xl">6</p>
				</div>
			</div>
		</header>
	);
}

export default UserPanel;
