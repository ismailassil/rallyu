import { motion } from "framer-motion";
import { Globe, WifiSlash } from "@phosphor-icons/react";

function Access({ access, setAccess, error, setError }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className="min-h-11 flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base"
		>
			<label className="w-full flex-1" htmlFor="picture">
				Access Mode
			</label>
			<div className="flex-2 w-full">
				{error && (
					<p className="mb-1 text-red-500">Choose between the available access modes below.</p>
				)}
				<div
					className={`*:flex *:justify-center *:items-center *:px-1
							*:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
							rounded-md border-2  ${error ? "border-red-700" : "border-white/10"} border-white/10 px-1 py-1`}
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setAccess(0);
							setError(false);
						}}
						className={`w-full ${
							access === 0 ? "bg-white text-black" : "hover:bg-white hover:text-black"
						}`}
					>
						<Globe size={18} />
						Public
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setAccess(1);
							setError(false);
						}}
						className={`w-full ${
							access === 1 ? "bg-white text-black" : "hover:bg-white hover:text-black"
						}`}
					>
						<WifiSlash size={18} />
						Private
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default Access;
