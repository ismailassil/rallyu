import { motion } from "framer-motion";

function Board({
	className,
	label,
	boardColor,
	setBoardColor,
}: {
	className?: string;
	label: string;
	boardColor: "bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four";
	setBoardColor: React.Dispatch<
		React.SetStateAction<"bg-theme-one" | "bg-theme-two" | "bg-theme-three" | "bg-theme-four">
	>;
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
							setBoardColor("bg-theme-one");
						}}
						className={`bg-theme-one w-full
								${boardColor === "bg-theme-one" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor("bg-theme-two");
						}}
						className={`bg-theme-two w-full
								${boardColor === "bg-theme-two" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor("bg-theme-three");
						}}
						className={`bg-theme-three w-full
								${boardColor === "bg-theme-three" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setBoardColor("bg-theme-four");
						}}
						className={`bg-theme-four w-full
								${boardColor === "bg-theme-four" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
				</div>
			</div>
		</motion.div>
	);
}

export default Board;
