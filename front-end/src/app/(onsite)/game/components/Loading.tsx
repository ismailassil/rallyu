import geistSans from "@/app/fonts/geistSans";
import { motion } from "framer-motion";

function Loading({ setStart }: { setStart: (value: boolean) => void }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.3 }}
			className="w-full h-full flex p-3 flex-col max-w-300 items-center justify-center"
		>
			<h1 className="text-3xl lg:text-5xl font-bold loadingText">
				{"Setting Things Up".split("").map((char, index) => (
					<motion.span
						key={index}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.05 }}
					>
						{char}
					</motion.span>
				))}
			</h1>
			<motion.p
				className="text-sm lg:text-lg mt-3 text-gray-400 animate-pulse"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
			>
				We’re almost ready. Hang tight.
			</motion.p>
			<motion.div
				className="loader mt-5"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.7 }}
			></motion.div>
			<motion.button
				className={`${geistSans.className} mt-10 w-full h-11 max-h-12 max-w-50
									rounded-full min-h-11 lg:h-13 lg:min-h-13 text-base lg:text-lg flex-1
									font-semibold ring-2 uppercase cursor-pointer
									hover:scale-101 transition-all duration-300 hover:bg-white
									hover:text-main hover:ring-3 ring-white/20
									loader
								`}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.4 }}
				onClick={(e) => {
					e.preventDefault();
					setStart(false);
				}}
			>
				Cancel
			</motion.button>
		</motion.div>
	);
}

export default Loading;
