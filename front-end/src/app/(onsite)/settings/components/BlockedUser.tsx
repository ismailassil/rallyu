import { MinusCircle } from "@phosphor-icons/react";
import Image from "next/image";

function BlockedUser({ user }: { user: { name: string; img: string } }) {
	return (
		<div
			className="bg-white/6 hover:bg-white/8 ring-white/9 flex h-12 items-center justify-between gap-2
					rounded-sm px-4 ring-2 hover:ring-white/20"
		>
			<div className="flex items-center gap-2">
				<div
					className="min-h-8 min-w-8 max-w-8
				flex aspect-square max-h-8 overflow-hidden rounded-full"
				>
					<Image src={user.img} alt="Profile Image" width={40} height={40} className="object-cover" />
				</div>
				<p>{user.name}</p>
			</div>
			<MinusCircle size={24} className="cursor-pointer hover:text-red-500" />
		</div>
	);
}

export default BlockedUser;
