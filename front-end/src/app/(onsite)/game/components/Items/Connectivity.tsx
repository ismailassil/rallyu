import { motion } from "framer-motion";
import { Globe, WifiSlash } from "@phosphor-icons/react";

function Connectivity({
	connectivity,
	setConnectivity,
}: {
	connectivity: number;
	setConnectivity: (value: number) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base min-h-11"
		>
			<label className="flex-1 w-full" htmlFor="picture">
				Base Connectivity Mode
			</label>
			<div className="flex-2 w-full">
				<div
					className="flex gap-2 border-2 border-white/10
							*:flex *:justify-center *:items-center rounded-md py-1 px-1 *:px-1 *:py-1 *:rounded-sm *:gap-2
							*:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer"
				>
					<div
						onClick={(e) => {
							e.preventDefault();
							setConnectivity(0);
						}}
						className={`w-full ${connectivity === 0 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<Globe size={18} />
						Online
					</div>
					<div
						onClick={(e) => {
							e.preventDefault();
							setConnectivity(1);
						}}
						className={`w-full ${connectivity === 1 ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
					>
						<WifiSlash size={18} />
						Local
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default Connectivity;
