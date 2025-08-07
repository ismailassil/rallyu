import geistSans from "@/app/fonts/geistSans";

const Timer = ({secondsLeft}: {secondsLeft: number}) => {
	return (
		<div
			className={`bg-white/8 ring-white/15 *:flex *:items-center *:justify-center
						transform-all hover:scale-102 flex h-full w-full flex-[0.5]
						flex-col rounded-full text-center ring-1
						duration-700
						${geistSans.className}`}
		>
			<span className={`flex-1 text-3xl font-light`}>
				{secondsLeft}
			</span>
		</div>
	);
};

export default Timer;
