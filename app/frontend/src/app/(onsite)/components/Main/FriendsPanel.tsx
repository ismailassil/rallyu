// import Image from "next/image";
import unicaOne from "@/app/fonts/unicaOne";
import Friend from "./Friend";

export default function FriendsPanel() {
	return (
		<aside className="bg-card border-br-card flex-2 hidden h-full w-full rounded-lg border-2 2xl:block">
			<div className="flex h-full flex-col">
				<div className="group relative shrink-0 overflow-hidden">
					<h1 className={`${unicaOne.className} p-13 select-none text-4xl uppercase`}>
						Friends
					</h1>
					<div
						className="w-18 h-18 bg-accent
					absolute -left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
					transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
				<div className="custom-scroll max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto">
					{/* <div className="flex flex-col mt-20 justify-center items-center">
						<Image
							src="/meme/sad.png"
							alt="Nothing"
							width={200}
							height={200}
							className="rounded-lg"
						/>
						<p className="mt-5 text-xl">You have no friends</p>
						<p className="text-lg text-gray-500">Try find some new friends</p>
					</div> */}

					<div className="flex flex-col gap-y-2 pb-4 pl-4 pr-4">
						{Array.from({ length: 30 }).map((_, i) => (
							<Friend
								key={i}
								img="/profile/image_2.jpg"
								fullname="Salah Demnati"
								isOnline={(i === 0 || i === 1) && true}
							/>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
