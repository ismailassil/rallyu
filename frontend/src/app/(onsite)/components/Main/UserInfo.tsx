import unicaOne from "@/app/fonts/unicaOne";
import Image from "next/image";

type UserInfoProps = {
	firstname: string;
};

export default function UserInfo({ firstname }: UserInfoProps) {
	return (
		<header
			className="p-13 bg-card border-br-card flex
				h-full max-h-[200px] min-h-[360px] w-full items-center
				gap-10 overflow-hidden rounded-lg border-2 sm:grid sm:min-h-[330px] sm:grid-cols-none
				sm:grid-rows-[0.5fr_1fr] md:min-h-[400px] md:grid-cols-[1fr_0.5fr] md:grid-rows-none"
		>
			<div className="flex h-full flex-1 flex-col justify-between py-5">
				<div>
					<div className="group relative select-none">
						<h1 className={`${unicaOne.className} mb-10 text-4xl font-semibold lg:text-5xl`}>
							WELCOME BACK, <span className="text-accent">{firstname}</span>
						</h1>
						<div
							className="-left-17 w-18 h-18
						bg-accent absolute top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
						transition-all duration-200 group-hover:scale-105"
						></div>
					</div>
					<p className="text-gray-400">Step into a World of Classy Gaming</p>
				</div>
				<div className="">
					<p className="mb-2 pt-10">Level 10</p>
					<div className=" bg-notwhite h-2 w-[100%] rounded-full">
						<div className="bg-accent h-2 w-[60%] rounded-full"></div>
					</div>
				</div>
			</div>
			<div className="hidden w-full justify-center md:flex">
				<div
					className="justify-right hover:scale-101 hidden h-[90px] w-[90px] items-center transition-transform duration-200
				md:flex md:h-[250px] md:w-[250px] md:items-center md:justify-center"
				>
					<Image
						className="ring-6 ring-br-image hover:ring-7 hover:scale-101 h-full w-full rounded-full object-cover transition-transform duration-200"
						src="/profile/image.png"
						alt="Profile Image"
						width={250}
						height={250}
					/>
				</div>
			</div>
		</header>
	);
}
