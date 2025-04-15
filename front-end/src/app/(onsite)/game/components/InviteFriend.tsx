import unicaOne from "@/app/fonts/unicaOne";
import BattleFriend from "./BattleFriend";
import { useState } from "react";
import useIsWidth from "../../components/useIsWidth";
// import Image from "next/image";

function InviteFriend() {
	const isWidth = useIsWidth(1024);
	const [show, setShow] = useState(true);

	return (
		// w-full lg:min-w-80 lg:max-w-100
		<div
			className={`flex-[0.70] w-full h-full flex flex-col ${isWidth && show && "max-h-22 lg:max-h-27"} cursor-pointer lg:cursor-auto bg-card border-1 border-br-card rounded-lg`}
			onClick={(e) => {
				e.preventDefault();
				setShow(!show);
			}}
		>
			<div className="h-auto max-h-30 min-h-20">
				<div className="relative overflow-hidden group">
					<h1
						className={`${unicaOne.className} p-10 py-6 lg:py-9 uppercase text-[28px] lg:text-3xl
									select-none duration-200 transition-all hover:scale-x-101 origin-left`}
					>
						Invite a friend
					</h1>
					<div
						className="absolute top-[calc(50%)] -left-5
							-translate-x-1/2 -translate-y-1/2 w-18 h-14 rounded-lg bg-accent
							duration-200 transition-all group-hover:scale-105"
					></div>
				</div>
			</div>
			<div
				className={`flex-1 flex flex-col ${isWidth && show && "hidden"} items-center px-4 gap-2
							overflow-y-scroll hide-scrollbar pb-4`}
			>
				{Array.from({ length: 10 }).map((_, i) => (
					<BattleFriend key={i} fullname={"Nabil Azouz"} img={"/image_1.jpg"} />
				))}
			</div>
			{/* <div className="flex-1 flex flex-col items-center mt-10 lg:mt-50 mb-10 overflow-y-scroll hide-scrollbar">
				<Image
					src="/sad.png"
					alt="Nothing"
					width={100}
					height={100}
					className="rounded-lg"
				/>
				<p className="mt-5 text-base lg:text-xl">You have no friends</p>
				<p className="text-sm lg:text-lg text-gray-500">
					Try find some new friends
				</p>
			</div> */}
		</div>
	);
}

export default InviteFriend;
