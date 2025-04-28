import Image from "next/image";

interface friendProps {
	fullname: string;
	isOnline?: boolean;
	img: string;
}

export default function Friend({ fullname, isOnline = false, img }: friendProps) {
	return (
		<div
			className="bg-card border-br-card hover:bg-hbg hover:border-hbbg hover:scale-101 flex
				items-center justify-between overflow-hidden rounded-xl border-2
				p-2 transition-transform duration-200 hover:cursor-pointer"
		>
			{/* Profile Image */}
			<div className="ml-1 flex h-[45px] w-[45px] justify-center rounded-full">
				<Image
					className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-lg capitalize">{fullname}</h2>
				<p className={`${isOnline ? "text-isOnline" : "text-gray-500"} text-sm`}>
					{isOnline ? "Online" : "Offline"}
				</p>
			</div>

			{/* Buttons */}
			<div className="flex gap-1">
				<Image
					className="hover:ring-br-card hover:cursor-pointer hover:rounded-full hover:ring-2"
					src="/icons/chat-btn.svg"
					width={50}
					height={50}
					alt="Chat Button Logo"
				/>
				{/* <Image
					className="hover:ring-3 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/icons/enter-btn.svg"
					width={50}
					height={50}
					alt="Enter Button Logo"
				/> */}
			</div>
		</div>
	);
}
