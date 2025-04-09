import Image from "next/image";

interface NotificationProps {
	setIsNotif: (value: boolean) => void;
	setIsProfile: (value: boolean) => void;
	setIsSearch: (value: boolean) => void;
	isNotif: boolean;
	notificationRef: React.Ref<HTMLDivElement>;
}

export default function Notification({
	setIsNotif,
	setIsProfile,
	setIsSearch,
	isNotif,
	notificationRef,
}: NotificationProps) {
	return (
		<div className="relative" ref={notificationRef}>
			<button
				className={`ml-4 rounded-full bg-card border-2 hover:cursor-pointer
							border-br-card w-[55px] h-[55px] flex justify-center items-center
							${
								isNotif
									? "bg-hbg border-hbbg ring-4 \
								ring-bbg scale-101"
									: "hover:bg-hbg hover:border-hbbg hover:ring-4 \
								hover:ring-bbg hover:scale-101"
							} transition-transform duration-200
								
								`}
				onClick={() => {
					setIsProfile(false);
					setIsSearch(false);
					setIsNotif(!isNotif);
				}}
			>
				<Image
					src="/notification.svg"
					alt="Notification Icon"
					width={0}
					height={0}
					style={{ width: "auto", height: "auto" }}
					className={`${isNotif && "animate-pulse"}`}
				/>
			</button>
			{isNotif && (
				<div
					className="absolute right-0 z-10 max-h-[348px] top-18 w-70 divide-y divide-bbg
							origin-top-right rounded-lg bg-card border-2 border-br-card
							backdrop-blur-lg overflow-scroll"
				>
					<div className="px-7 py-4 w-full flex sticky top-0 z-20 bg-card/70 backdrop-blur-3xl text-start justify-between items-center">
						<p>Notification</p>
						<div className="w-1 h-1 p-4 text-center flex items-center justify-center rounded-full bg-hbbg">
							0
						</div>
					</div>
					{Array.from({ length: 1 }).map((_, i) => (
						<p key={i} className="px-7 py-4 w-full flex text-start h-14">
							Nothing &#129488;
						</p>
					))}
				</div>
			)}
		</div>
	);
}
