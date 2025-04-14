// import Image from "next/image";
import unicaOne from "@/app/fonts/unicaOne";
import Friend from "./Friend";

export default function FriendsPanel() {
	return (
		<aside className="hidden xl:block bg-card border-2 border-br-card rounded-lg h-full w-full flex-2">
			<div className="flex flex-col h-full">
				<div className="relative overflow-hidden group shrink-0">
					<h1
						className={`${unicaOne.className} text-4xl p-13 uppercase select-none`}
					>
						Friends
					</h1>
					<div
						className="absolute top-[calc(50%)] -left-4
					-translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-lg bg-accent
					duration-200 transition-all group-hover:scale-105"
					></div>
				</div>
				<div className="overflow-y-auto flex-1 max-h-[calc(100vh-19rem)] custom-scroll">
					{/* <div className="flex flex-col mt-20 justify-center items-center">
						<Image
							src="/sad.png"
							alt="Nothing"
							width={200}
							height={200}
							className="rounded-lg"
						/>
						<p className="mt-5 text-xl">You have no friends</p>
						<p className="text-lg text-gray-500">Try find some new friends</p>
					</div> */}

					<div className="flex flex-col gap-y-2 pl-4 pr-4 pb-4">
						{Array.from({ length: 30 }).map((_, i) => (
							<Friend
								key={i}
								img="/image_2.jpg"
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
