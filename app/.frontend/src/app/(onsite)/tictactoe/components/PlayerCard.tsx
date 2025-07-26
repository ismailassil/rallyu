import Image from 'next/image';

interface PlayerCardProps {
	name?: string;
	image?: string;
	align?: 'left' | 'right';
	current: boolean;
}

const PlayerCard = ({
	name = 'Player 1',
	image = '/profile/lordVoldemort.jpeg',
	align = 'left',
	current,
}: PlayerCardProps) => {
	return (
		<>
			<div
				className={`hover:scale-102 flex w-full flex-1 select-none
					${current ? ' border-2 border-main' : 'border-2 border-white/4'}
					items-center gap-5 rounded-full border-1 bg-white/5 p-2 transition-all duration-400`}
			>
				{align === 'left' && (
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200 flex-shrink-0">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
							w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={image}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
				)}
				<p className={`text-wrap flex-1 text-${align}`}>{name}</p>
				{align === 'right' && (
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200 flex-shrink-0">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
							w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={image}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default PlayerCard;
