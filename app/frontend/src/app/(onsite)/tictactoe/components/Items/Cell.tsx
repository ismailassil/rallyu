import { CircleIcon, XIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

function Cell({
	index,
	cell,
	handleMove,
}: {
	index: number;
	cell: string;
	handleMove: (index: number) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: 'spring', stiffness: 160, damping: 10 }}
			className={`hover:scale-104 translate-all
				bg-white/4 flex rounded-md duration-300 cursor-pointer
				items-center justify-center hover:ring-2 hover:ring-white/15
			`}
			onClick={() => {
				handleMove(index);
			}}
		>
			{cell ? (
				cell === 'circle' ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<CircleIcon weight="bold" size={120} className="blue" />
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<XIcon weight="bold" size={120} className="yellow" />
					</motion.div>
				)
			) : (
				''
			)}
		</motion.div>
	);
}

export default Cell;
