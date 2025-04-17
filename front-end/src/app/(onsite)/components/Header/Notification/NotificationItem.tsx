import { Hash, PingPong } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

type NotificationProps = {
	sender: { img: string; name: string };
	message: string | null;
	type: "msg" | "pingpong" | "xo";
	uri: string;
};

function NotificationItem({ type, message, sender, uri }: NotificationProps) {
	const router = useRouter();
	if (message && message?.trim().length > 50) {
		message = message?.trim().substring(0, 50) + "...";
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="notice"
				initial={{ opacity: 0, y: -20, scale: 0.8 }}
				animate={{
					opacity: 1,
					y: 0,
					scale: 1,
					transition: { type: "spring", duration: 0.6, bounce: 0.5 },
				}}
				exit={{
					opacity: 0,
					y: -30,
					scale: 0.7,
					rotate: -5,
					transition: {
						type: "spring",
						duration: 0.5,
						bounce: 0.2,
						stiffness: 120,
						damping: 10,
					},
				}}
				className="max-w-80 min-w-80 z-201 bg-white/9
					ring-white/15 rounded-xs divide-y-1
					divide-white/11 absolute left-1/2 top-5 flex -translate-x-1/2
					flex-col overflow-hidden text-sm ring-2 backdrop-blur-xl
					"
			>
				<div className="flex justify-between gap-3 p-2">
					<div className="min-h-10 min-w-10 max-w-10 flex aspect-square max-h-10 overflow-hidden rounded-full">
						<Image src={sender.img} alt="Profile Image" width={40} height={40} className="object-cover" />
					</div>
					<div className="flex-1">
						<p className="font-bold">{sender.name}</p>
						<p>{type === "msg" ? message : "🎮 Ready to play?"}</p>
					</div>
					{type === "pingpong" ? <PingPong size={20} /> : type === "xo" && <Hash size={20} />}
				</div>
				<div className="*:w-full *:hover:bg-main divide divide-x-1 divide-white/11 *:text-center *:cursor-pointer flex w-full">
					<p
						className="rounded-b-xs pb-1 pt-1"
						onClick={(e) => {
							e.preventDefault();
							router.push(uri);
						}}
					>
						{type === "msg" ? "Reply" : "Accept"}
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default NotificationItem;
