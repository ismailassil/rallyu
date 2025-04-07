import Image from "next/image";

interface friendProps {
	fullname: string;
	isOnline?: boolean;
	img: string;
}

export default function Friend({
	fullname,
	isOnline = false,
	img,
}: friendProps) {

	return (
		<div className="flex bg-card border-2 border-br-card rounded-xl hover:bg-hbg hover:border-hbbg hover:scale-101 transition-transform duration-200 p-3 items-center overflow-hidden">
			{/* Profile Image */}
			<div className="ml-1 flex w-[55px] h-[55px] rounded-full justify-center">
				<Image
					className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-xl capitalize">{fullname}</h2>
				<p className={`${isOnline ? "text-isOnline" : "text-gray-500"}`}>
					{isOnline ? "Online" : "Offline"}
				</p>
			</div>

			{/* Buttons */}
			<div className="flex gap-1">
				<Image
					className="hover:ring-2 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/chat-btn.svg"
					width={50}
					height={50}
					alt="Chat Button Logo"
				/>
				<Image
					className="hover:ring-3 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/enter-btn.svg"
					width={50}
					height={50}
					alt="Enter Button Logo"
				/>
			</div>
		</div>
	);
}
