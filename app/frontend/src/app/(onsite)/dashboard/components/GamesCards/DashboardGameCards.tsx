import { useTranslations } from "next-intl";
import GameCard from "./GameCard";
import { useRouter } from "next/navigation";

const DashboardGameCards = () => {
	const router = useRouter();
	const t = useTranslations("dashboard.game");

	return (
		<div className="flex gap-4 flex-col md:flex-row">
			<GameCard
				isBackground={false}
				src={'/design/tourn_cup.png'}
				position="absolute 
					h-auto left-1/2 -z-1 -bottom-40
					md:block md:-bottom-20 md:translate-x-8 md:w-[260px]
					lg:-translate-x-1/2 lg:-bottom-40 lg:w-[300px]
					transform group-hover:-translate-y-5 group-hover:scale-105
					transition-transform duration-500"
				text={t('tournament.text')}
				textClass="lg:text-2xl text-base"
				subtext={t('tournament.subtext')}
				subtextClass="text-4xl md:text-3xl lg:text-4xl"
				transform="scale(1.1)"
				opacity="0.5"
				onClick={() => router.push("/tournament")}
				/>
			<GameCard
				src={'/design/racket_r.png'}
				background="/background/side/1vs1-dock.svg"
				position="absolute 
					h-auto left-1/2 -z-1 -bottom-10
					md:block md:bottom-0 md:translate-x-8 md:w-[260px]
					lg:-translate-x-1/2 lg:-bottom-14 lg:w-[300px]
					transform group-hover:-translate-y-5 group-hover:scale-105
					transition-transform duration-500"
				text={t('one_vs_one.text')}
				textClass="text-4xl lg:text-2xl"
				subtext={t('one_vs_one.subtext')}
				subtextClass="text-2xl lg:text-3xl"
				onClick={() => router.push("/game")}
				/>
			<GameCard
				src={'/design/single.svg'}
				background="/background/side/training-dock.svg"
				position="absolute 
				h-auto left-1/2 -z-1 -bottom-18
					md:block md:bottom-0 md:translate-x-8 md:w-[260px]
					lg:-translate-x-1/2 lg:-bottom-21 lg:w-[300px]
					transform group-hover:-translate-y-5 group-hover:scale-105
					transition-transform duration-500"
					text={t('training.text')}
					textClass="text-2xl lg:text-2xl"
					subtext={t("training.subtext")}
				subtextClass="text-4xl lg:text-4xl"
				transform="scale(1.1)"
				opacity="0.5"
				onClick={() => router.push("/game")}
				/>
		</div>
	);
};

export default DashboardGameCards;