import GameCard from "../../components/Main/GameCard";

const DashboardGameCards = () => {
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
				text="Conquer the"
				textClass="lg:text-2xl text-base"
				subtext="Tournament"
				subtextClass="text-4xl md:text-3xl lg:text-4xl"
				transform="scale(1.1)"
				opacity="0.5"
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
				text="1v1"
				textClass="text-4xl lg:text-2xl"
				subtext="Fight for Glory"
				subtextClass="text-2xl lg:text-3xl"
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
				text="Start"
				textClass="text-2xl lg:text-2xl"
				subtext="Training"
				subtextClass="text-4xl lg:text-4xl"
				transform="scale(1.1)"
				opacity="0.5"
			/>
		</div>
	);
};

export default DashboardGameCards;