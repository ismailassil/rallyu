interface MessageProps {
	username: string;
	date: string;
	message: string;
}

export default function Message({ username, date, message }: MessageProps) {
	let isMe = false;
	if (username === "Me") isMe = true;

	return (
		<div
			className={`flex w-full ${isMe && "justify-end"} lg:text-[17px] text-[15px]`}
		>
			<div className="flex flex-col gap-1 w-[90%] md:w-[75%]">
				<div
					className={`flex flex-col w-full text-wrap rounded-lg bg-main/25 ${isMe && "border-1 border-white/20 bg-white/0 rounded-br-none"} p-2 px-4`}
				>
					<div className={`flex flex-col`}>
						<p>{message}</p>
					</div>
				</div>
				<p className={`text-gray-400 text-xs lg:text-sm ${isMe && "text-end"}`}>
					{date}
				</p>
			</div>
		</div>
	);
}
