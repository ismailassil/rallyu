import { MinusCircle } from "@phosphor-icons/react";
import Image from "next/image";

function BlockedUser({ user }: { user: { name: string; img: string } }) {
	return (
		<div
			className="bg-white/6 rounded-sm h-12 flex px-4 gap-2 items-center justify-between
					hover:bg-white/8 ring-2 ring-white/9 hover:ring-white/20"
		>
			<div className="flex gap-2 items-center">
				<div
					className="flex rounded-full overflow-hidden
				aspect-square max-h-8 min-h-8 min-w-8 max-w-8"
				>
					<Image
						src={user.img}
						alt="Profile Image"
						width={40}
						height={40}
						className="object-cover"
					/>
				</div>
				<p>{user.name}</p>
			</div>
			<MinusCircle size={24} className="cursor-pointer hover:text-red-500" />
		</div>
	);
}

export default BlockedUser;
