import Image from "next/image";

export default function ChatFriend({
	onClick,
	className,
}: {
	onClick: (e: React.MouseEvent<HTMLElement>) => void;
	className: string;
}) {
	const thefullname = "Azouz Nabil";
	const fullname =
		thefullname.trim().length > 16
			? thefullname.trim().substring(0, 16) + "..."
			: thefullname.trim();
	const msg = "Message asfsadkfjl asdklfj askldfjaklsdfj";
	const mmsg = msg.trim().length > 16 ? msg.trim().substring(0, 16) + "..." : msg;

	return (
		<div
			className={`flex w-full h-14 min-h-14 max-h-14 lg:h-16 lg:min-h-16 lg:max-h-16 justify-between p-3 hover:bg-hbbg
					rounded-lg lg:rounded-xl hover:cursor-pointer overflow-hidden ${className}`}
			onClick={onClick}
		>
			<div className="flex w-full gap-3 items-center">
				<div className="flex w-[40px] h-[40px] lg:w-[42px] lg:h-[42px] rounded-full justify-center aspect-square">
					<Image
						className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
						src="/image_1.jpg"
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
				<div className="flex flex-col w-full overflow-hidden">
					<div className="flex justify-between items-center w-full">
						<p className="truncate text-base lg:text-base">{fullname}</p>
						<p className="text-gray-400 truncate ml-2 text-xs lg:text-sm text-wrap">
							01/01/1999
						</p>
					</div>
					<div className="flex justify-between items-center w-full">
						<p className="font-light text-gray-400 truncate text-xs lg:text-sm">
							{mmsg}
						</p>
						<p className="h-2 w-2 lg:h-3 lg:w-3 bg-main rounded-full inline-block shrink-0 ml-2"></p>
					</div>
				</div>
			</div>
		</div>
	);
}
