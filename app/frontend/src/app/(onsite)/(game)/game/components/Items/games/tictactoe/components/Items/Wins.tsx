import Image from "next/image";
import {motion} from "framer-motion";

const Wins = ({winner, img}: {winner: string, img: string}) => {
	return (
		<div className="flex gap-4 flex-col">
			<motion.div
				className="hover:scale-101 h-50 w-50 flex transition-transform duration-200"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
			>
				<Image
					className="ring-br-image hover:scale-101 hover:ring-3 h-full
							w-full rounded-full object-cover ring-2
							transition-transform duration-500"
					src={img}
					alt="Profile Image"
					width={250}
					height={250}
				/>
			</motion.div>
			<motion.h2
				className="text-center text-4xl flex  flex-col gap-3"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
			>
				<span className="font-bold">{winner}</span> <br />
				<span className="text-5xl">{"WINS!"}</span>
			</motion.h2>
		</div>
	);
};

export default Wins;