import geistSans from '@/app/fonts/geistSans';

const RoundDisplay = ({ round }: { round: number }) => {
	return (
		<div className="min-h-10 flex w-full select-none justify-center">
			<p
				className="w-35 border-white/4 hover:scale-102 flex h-full items-center justify-between
							rounded-full border-2 bg-white/5 px-4 transition-all duration-500"
			>
				<span className="font-light">Round</span>&nbsp;
				<span className={`${geistSans.className} text-xl font-bold`}>
					{round}
				</span>
			</p>
		</div>
	);
};

export default RoundDisplay;
