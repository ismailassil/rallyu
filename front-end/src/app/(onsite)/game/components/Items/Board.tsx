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
			className={`flex flex-col items-center justify-between gap-2 md:flex-row ${
				!className ? "lg:gap-10" : className
			} lg:min-h-11 text-sm lg:text-base`}
		>
			<label className="w-full flex-1" htmlFor="picture">
				{label}
			</label>
			<div className={`${className ? "flex-2" : "flex-3"} w-full`}>
				<div
					className="*:h-10 *:flex *:justify-center *:items-center *:px-1
							*:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
							rounded-md border-2 border-white/10 px-1 py-1"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(0);
						}}
						className={`bg-theme-one w-full
								${boardColor === 0 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(1);
						}}
						className={`bg-theme-two w-full
								${boardColor === 1 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(2);
						}}
						className={`bg-theme-three w-full
								${boardColor === 2 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor(3);
						}}
						className={`bg-theme-four w-full
								${boardColor === 3 ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
				</div>
			</div>
		</motion.div>
	);
}

export default Board;
