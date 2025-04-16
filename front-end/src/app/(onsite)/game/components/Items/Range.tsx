import { motion } from "framer-motion";

function Ball({
	className,
	label,
	value,
	setValue,
}: {
	className?: string;
	label: string;
	value: number;
	setValue: (value: number) => void;
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
			<div
				className={`relative flex items-center gap-4 ${
					className ? "flex-2" : "flex-3"
				} w-full`}
			>
				<input
					type="range"
					className="custom-range h-0.5 w-full cursor-pointer appearance-none rounded-lg bg-[#92929283] outline-none"
					min="0"
					max="10"
					value={value}
					step="1"
					id="paddle-width"
					onChange={(e) => {
						setValue(Number(e.target.value));
					}}
				/>
				<div className="min-w-8 flex justify-center rounded-md bg-gray-800 px-2 py-1 text-xs text-white transition-all duration-200">
					{value}
				</div>
			</div>
		</motion.div>
	);
}

export default Ball;
