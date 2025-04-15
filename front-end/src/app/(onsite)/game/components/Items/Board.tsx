import { motion } from "framer-motion";

function Board({
	className,
	label,
	boardColor,
	setBoardColor,
}: {
	className?: string;
	label: string;
	boardColor: number;
	setBoardColor: (value: number) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			className={`flex justify-between flex-col md:flex-row items-center gap-2 ${!className ? "lg:gap-10" : className} text-sm lg:text-base lg:min-h-11`}
		>
			<label className="flex-1 w-full" htmlFor="picture">
				{label}
			</label>
			<div className={`${className ? "flex-2" : "flex-3"} w-full`}>
				<div
					className="flex gap-2 border-2 border-white/10 *:h-10
							*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
							*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(0);
						}}
						className={`w-full bg-theme-one
								${boardColor === 0 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(1);
						}}
						className={`w-full bg-theme-two
								${boardColor === 1 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(2);
						}}
						className={`w-full bg-theme-three
								${boardColor === 2 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(3);
						}}
						className={`w-full bg-theme-four
								${boardColor === 3 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
				</div>
			</div>
		</motion.div>
	);
}

export default Board;
