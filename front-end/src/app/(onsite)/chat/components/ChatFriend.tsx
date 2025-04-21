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
			className={`min-h-14 lg:min-h-16 hover:bg-hbbg flex h-14 max-h-14 w-full justify-between overflow-hidden rounded-lg p-3
					hover:cursor-pointer lg:h-16 lg:max-h-16 lg:rounded-xl ${className}`}
			onClick={onClick}
		>
			<div className="flex w-full items-center gap-3">
				<div className="flex aspect-square h-[40px] w-[40px] justify-center rounded-full lg:h-[42px] lg:w-[42px]">
					<Image
						className="ring-fr-image h-full w-full rounded-full object-cover ring-2"
						src="/image_1.jpg"
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
				<div className="flex w-full flex-col overflow-hidden">
					<div className="flex w-full items-center justify-between">
						<p className="truncate text-base lg:text-base">{fullname}</p>
						<p className="text-wrap ml-2 truncate text-xs text-gray-400 lg:text-sm">
							01/01/1999
						</p>
					</div>
					<div className="flex w-full items-center justify-between">
						<p className="truncate text-xs font-light text-gray-400 lg:text-sm">{mmsg}</p>
						<p className="bg-main ml-2 inline-block h-2 w-2 shrink-0 rounded-full lg:h-3 lg:w-3"></p>
					</div>
				</div>
			</div>
		</div>
	);
}
