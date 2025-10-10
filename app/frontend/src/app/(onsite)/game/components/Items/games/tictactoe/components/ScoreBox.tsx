import geistSans from '@/app/fonts/geistSans';

const ScoreBox = ({ score }: { score: number }) => {
	return (
		<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>
			{score}
		</div>
	);
};

export default ScoreBox;
