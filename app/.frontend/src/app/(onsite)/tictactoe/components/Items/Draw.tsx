import Image from "next/image";
import {motion} from 'framer-motion';

const Draw = () => {
	return (
		<motion.div
			className="ring-br-image
					hover:scale-101 relative flex h-80 overflow-hidden
					rounded-lg ring-2 transition-transform duration-500"
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			<Image
				className="h-full
							w-full object-cover "
				src={"/meme/draw.jpeg"}
				alt="Meme Image"
				width={500}
				quality={100}
				height={300}
			/>
		</motion.div>
	);
};

export default Draw;