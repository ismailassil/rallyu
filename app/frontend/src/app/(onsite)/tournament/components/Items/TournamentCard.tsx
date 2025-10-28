import { ArrowUUpRight, Check, HourglassSimpleMediumIcon, MaskSad, SmileyXEyesIcon, TrophyIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useTranslations } from "next-intl";

function TournamentCard({
	id,
	name,
	active,
	size,
	isPingPong,
	isUserIn,
	state
}: {
	id: number;
	name: string;
	active: number;
	size: number;
	isPingPong: boolean;
	isUserIn: boolean;
	state: string;
}) {
	const { loggedInUser, apiClient } = useAuth();
	const router = useRouter();
	const [joined, setJoined] = useState(isUserIn);
	const translate = useTranslations("tournament")

	if (name && name.length > 25) {
		name = name.substring(0, 23) + "...";
	}

	const linkHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
		const target: HTMLElement = e.target as HTMLElement;

		if (target.closest("button")) {
			try {
				const res: AxiosResponse = await apiClient.instance.patch(`/v1/tournament/match/join/${id}`, { id: loggedInUser?.id });
				setJoined(true);
			} catch (err: unknown) {
				console.error(err);
			}
			return;
		}
		const id_ = target.closest("div")?.id;
		if (id_ && ["entered-id", "full-id", "ongoing-id", "finished-id", "cancelled-id"].includes(id_))
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
						<p className="font-light">{ translate("panel.card.contenders") }</p>
						{/* Active players */}
						<p>{active}/{size}</p>
					</div>
					{
						state === "pending" && ((active === size && !joined) ?
						(
							<div
								id="full-id" 
								className="flex items-center justify-center gap-2 rounded-sm cursor-auto py-0.5 outline-white/10 outline"
							>
								<span className="text-sm">{ translate("panel.card.full") }</span>
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
										<span className="text-sm">{ translate("panel.card.join") }</span>
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
										<span className="text-sm">{ translate("panel.card.entered") }</span>
										<Check size={16} />
									</motion.div>
								)}
							</AnimatePresence>
						))
					}
					{
						state === "ongoing" &&
							<div 
								id="ongoing-id"
								className="flex items-center justify-center gap-2 rounded-sm cursor-auto py-0.5 outline-yellow-400/10 outline"
							>
								<span className="text-sm text-yellow-400">{ translate("panel.card.ongoing") }</span>
								<HourglassSimpleMediumIcon size={16} className="text-yellow-400" />
							</div>
					}
					{
						state === "finished" &&
							<div 
								id="finished-id"
								className="flex items-center justify-center gap-2 rounded-sm cursor-auto py-0.5 outline-blue-400/10 outline"	
							>
								<span className="text-sm text-blue-400">{ translate("panel.card.completed") }</span>
								<TrophyIcon size={16} className="text-blue-400" />
							</div>
					}
					{
						state === "cancelled" &&
							<div 
								id="cancelled-id"
								className="flex items-center justify-center gap-2 rounded-sm cursor-auto py-0.5 outline-red-400/10 outline"
							>
								<span className="text-sm text-red-400">{ translate("panel.card.cancelled") }</span>
								<SmileyXEyesIcon size={16} className="text-red-400" />
							</div>
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
