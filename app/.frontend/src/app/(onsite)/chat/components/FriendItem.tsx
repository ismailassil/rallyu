import moment from "moment";
import Image from "next/image";

export default function FriendItem({
	onClick,
	className,
}: {
	onClick: (e: React.MouseEvent<HTMLElement>) => void;
	className: string;
}) {
	const fullname = "Azouz Nabil";
	const msg = "Message asfsadkfjl asdklfj askldfjaklsdfj asfklj iqweru";

	const date = moment("01-07-2025", "DD-MM-YYYY").fromNow();

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
						src="/profile/image_1.jpg"
						width={100}
						height={100}
						alt="Profile Image"
					/>
				</div>
				<div className="flex w-full flex-col overflow-hidden">
					<div className="flex w-full items-center justify-between">
						<p className="line-clamp-1 flex-1 text-base lg:text-base">{fullname}</p>
						<p className="text-wrap ml-2 truncate text-xs text-gray-400 lg:text-sm">
							{date}
						</p>
					</div>
					<div className="flex w-full items-center justify-between">
						<p className="line-clamp-1 w-[85%] text-xs font-light text-gray-400 lg:text-sm">
							{msg}
						</p>
						<div className="bg-main ml-2 inline-block h-2 w-2 shrink-0 rounded-full lg:h-3 lg:w-3" />
					</div>
				</div>
			</div>
		</div>
	);
}
