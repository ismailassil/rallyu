interface MessageProps {
	username: string;
	date: string;
	message: string;
}

export default function Message({ username, date, message }: MessageProps) {
	let isMe = false;
	if (username === "Me") isMe = true;

	return (
		<div className={`flex w-full ${isMe && "justify-end"} text-[15px] lg:text-[17px]`}>
			<div className="flex w-[90%] flex-col gap-1 md:w-[75%]">
				<div
					className={`text-wrap bg-main/25 flex w-full flex-col rounded-lg
						${isMe && "border-1 rounded-br-none border-white/20 bg-white/0"} p-2 px-4`}
				>
					<div className={`flex flex-col`}>
						<p className="text-sm lg:text-[15px]">{message}</p>
					</div>
				</div>
				<p className={`text-xs text-gray-400 lg:text-sm ${isMe && "text-end"}`}>{date}</p>
			</div>
		</div>
	);
}
