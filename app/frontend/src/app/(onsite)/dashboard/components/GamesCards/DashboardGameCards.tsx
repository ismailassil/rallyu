import { useTranslations } from "next-intl";
import GameCard from "./GameCard";
import { useRouter } from "next/navigation";

const DashboardGameCards = () => {
	const router = useRouter();
	const t = useTranslations("dashboard.game");

	return (
		<div className="flex gap-4 flex-col md:flex-row">
			<GameCard
				src={'/design/tourn_cup.png'}
				position="absolute 
					h-auto left-1/2 -z-1 -bottom-25 group-hover:opacity-90
					md:-translate-x-1/2 md:-bottom-30 md:w-[300px]
					transform group-hover:-translate-y-7 group-hover:scale-105 group-hover:z-1
					transition-transform duration-500"
				text={t('tournament.text')}
				textClass="sm:text-2xl text-base group-hover:opacity-50 duration-300"
				subtext={t('tournament.subtext')}
				subtextClass="text-4xl sm:text-3xl lg:text-4xl group-hover:opacity-50 duration-300"
				onClick={() => router.push("/tournament")}
				/>
			<GameCard
				src={'/dashboard/pp_xo.png'}
				background="/background/side/1vs1-dock.svg"
				position="absolute brightness-150
					h-auto left-1/2 -z-1 -bottom-40 size-full w-120
					md:-translate-x-1/2 md:-bottom-35 group-hover:z-1 overflow-hidden
					transform group-hover:-translate-y-10 group-hover:scale-105
					transition-transform duration-500"
				text={t('one_vs_one.text')}
				textClass="lg:text-2xl text-base group-hover:opacity-50 duration-300"
				subtext={t('one_vs_one.subtext')}
				subtextClass="text-4xl md:text-3xl lg:text-4xl group-hover:opacity-50 duration-300"
				onClick={() => router.push("/game")}
				/>
		</div>
	);
};

export default DashboardGameCards;