import { motion } from "framer-motion";

function Colors({
	className,
	handleSet,
	setColor,
	Color,
	innerColor,
	label,
	children,
}: {
	className?: string;
	handleSet: (
		setFunction: (value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500") => void,
		value: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500",
		rvalue: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500"
	) => void;
	setColor: React.Dispatch<
		React.SetStateAction<"bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500">
	>;
	Color: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500";
	innerColor: "bg-red-700" | "bg-yellow-500" | "bg-blue-600" | "bg-teal-500";
	label: string;
	children: React.ReactNode;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			className={`flex flex-col items-center justify-between gap-2 md:flex-row ${
				className ? className : "lg:gap-10"
			} text-sm lg:text-base`}
		>
			<label className="flex w-full flex-1 items-center gap-2" htmlFor="picture">
				{children} {label}
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
							handleSet(setColor, "bg-red-700", Color);
						}}
						className={`w-full bg-red-700
								${innerColor === "bg-red-700" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							handleSet(setColor, "bg-yellow-500", Color);
						}}
						className={`w-full bg-yellow-500
								${innerColor === "bg-yellow-500" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							handleSet(setColor, "bg-blue-600", Color);
						}}
						className={`w-full bg-blue-600
								${innerColor === "bg-blue-600" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
					<div
						onClick={(e) => {
							e.preventDefault();
							handleSet(setColor, "bg-teal-500", Color);
						}}
						className={`w-full bg-teal-500
								${innerColor === "bg-teal-500" ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/40"}`}
					></div>
				</div>
			</div>
		</motion.div>
	);
}

export default Colors;
