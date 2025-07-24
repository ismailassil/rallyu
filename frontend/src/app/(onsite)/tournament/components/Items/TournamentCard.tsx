import { ArrowUUpRight, Check, MaskSad } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { button } from "framer-motion/client";

function TournamentCard({
	id,
	name,
	active,
	size,
	isPingPong,
	isUserIn,

}: {
	id: number;
	name: string;
	active: number;
	size: number;
	isPingPong: boolean;
	isUserIn: boolean;
}) {
	const router = useRouter();
	const [joined, setJoined] = useState(isUserIn);

	if (name && name.length > 25) {
		name = name.substring(0, 23) + "...";
	}

	const linkHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
		const target: HTMLElement = e.target as HTMLElement;

		if (target.closest("button")) {
			console.log("BRUH");
			try {
				const req = await fetch(`http://localhost:3008/api/v1/tournament-matches/join/${id}`, {
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						id: 2, // I need user ID
					}),
				});

				await req.json();

				if (!req.ok) throw "Error";

				setJoined(true);
			} catch (err) {
				console.error(err);
			}
			return;
		}
		if (["entered-id", "full-id"].includes(target.closest("div")?.id))
			return;
		router.push(`tournament/stage/${id}`);
	};

	return (
		<div
			className="*:flex *:justify-between min-h-31 bg-card group relative flex select-none flex-col justify-between
					gap-2 overflow-hidden py-2"
		>
			<div className="z-1 relative flex w-full flex-1 flex-col gap-3" onClick={linkHandler}>
				<Image
					src={!isPingPong ? "/design/tictactoe.svg" : "/design/pingpong.svg"}
					width={70}
					height={70}
					alt="XO Image"
					className="rotate-20 group-hover:-rotate-10 absolute -right-7
						-top-6 transition-all duration-500 group-hover:-right-3 group-hover:-top-3"
				/>
				<p className="font-semibold">{name}</p>
				<div className="flex flex-col gap-2">
					<div className="relative flex justify-between text-sm">
						<p className="font-light">Contenders</p>
						{/* Active players */}
						<p>{active}/{size}</p>
					</div>
					{
						active === size ?
						(
							<div
								id="full-id" 
								className="flex items-center justify-center gap-2 rounded-sm cursor-auto py-0.5 outline-white/10 outline"
							>
								<span className="text-sm">Full</span>
								<MaskSad size={16} />
							</div>
						) :
						(
							<AnimatePresence mode="wait">
								{!joined ? (
									<motion.button
										exit={{ opacity: 0, scale: 0 }}
										transition={{ duration: 0.3, ease: "easeOut" }}
										key={1}
										className="hover:bg-main flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-white/20 py-0.5"
									>
										<span className="text-sm">Join</span>
										<ArrowUUpRight size={16} />
									</motion.button>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.5, rotate: -4 }}
										animate={{ opacity: 1, scale: 1 ,rotate: 0  }}
										transition={{ duration: 0.4, ease: "easeOut" }}
										key={2}
										id="entered-id"
										className="bg-main flex cursor-auto items-center justify-center gap-2 rounded-sm py-0.5"
										>
										<span className="text-sm">Entered</span>
										<Check size={16} />
									</motion.div>
								)}
							</AnimatePresence>
						)
					}
				</div>
			</div>
			<div
				className="tournament-bg hover:scale-101 duration-900 -z-1 absolute left-0
					top-0 h-full w-full opacity-0 transition-all group-hover:opacity-30"
			/>
		</div>
	);
}

export default TournamentCard;
