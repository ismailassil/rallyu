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
			className={`flex h-full w-full flex-[0.70] flex-col ${
				isWidth && show && "max-h-22 lg:max-h-27"
			} bg-card border-1 border-br-card cursor-pointer rounded-lg lg:cursor-auto`}
			onClick={(e) => {
				e.preventDefault();
				setShow(!show);
			}}
		>
			<div className="max-h-30 min-h-20 h-auto">
				<div className="group relative overflow-hidden">
					<h1
						className={`${unicaOne.className} hover:scale-x-101 origin-left select-none p-10 py-6 text-[28px]
									uppercase transition-all duration-200 lg:py-9 lg:text-3xl`}
					>
						Invite a friend
					</h1>
					<div
						className="w-18 bg-accent absolute
							-left-5 top-[calc(50%)] h-14 -translate-x-1/2 -translate-y-1/2 rounded-lg
							transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
			</div>
			<div
				className={`flex flex-1 flex-col ${
					isWidth && show && "hidden"
				} hide-scrollbar items-center gap-2
							overflow-y-scroll px-4 pb-4`}
			>
				{Array.from({ length: 10 }).map((_, i) => (
					<BattleFriend
						key={i}
						fullname={"Nabil Azouz"}
						img={"/image_1.jpg"}
					/>
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
