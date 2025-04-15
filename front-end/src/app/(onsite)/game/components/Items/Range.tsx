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
			className={`flex justify-between flex-col md:flex-row items-center gap-2 ${!className ? "lg:gap-10" : className} text-sm lg:text-base lg:min-h-11`}
		>
			<label className="flex-1 w-full" htmlFor="picture">
				{label}
			</label>
			<div
				className={`relative flex gap-4 items-center ${className ? "flex-2" : "flex-3"} w-full`}
			>
				<input
					type="range"
					className="w-full h-0.5 bg-[#92929283] rounded-lg outline-none appearance-none custom-range cursor-pointer"
					min="0"
					max="10"
					value={value}
					step="1"
					id="paddle-width"
					onChange={(e) => {
						setValue(Number(e.target.value));
					}}
				/>
				<div className="bg-gray-800 min-w-8 text-white text-xs px-2 py-1 rounded-md transition-all duration-200 flex justify-center">
					{value}
				</div>
			</div>
		</motion.div>
	);
}

export default Ball;
