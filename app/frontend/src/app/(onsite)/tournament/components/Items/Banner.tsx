import unicaOne from "@/app/fonts/unicaOne";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function Banner() {
	const translate = useTranslations("tournament");

	return (
		<motion.div
			initial={{ opacity: 0, y: -20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -20, scale: 0.9 }}
			transition={{ duration: 0 }}
			className="md:h-85 min-h-70 max-h-85 hover:scale-101 h-70 group relative flex w-full cursor-crosshair
			select-none flex-col justify-center overflow-hidden rounded-lg px-10 transition-all duration-700"
		>
			<h1
				className={`${unicaOne.className}
					group-hover:text-main group-hover:scale-101 duration-900 z-10 mb-5 text-5xl uppercase transition-all md:w-[50%] lg:w-full lg:text-6xl`}
			>
				<span className="font-semibold">{ translate("panel.ad-header") }</span>
			</h1>
			<p className="group-hover:text-main group-hover:scale-101 duration-900 z-10 pl-1 text-base font-light transition-all md:w-[50%] lg:w-full lg:text-lg">
				{ translate("panel.ad-description") }
			</p>
			<div
				className="tournament-bg group-hover:scale-101 duration-900 absolute left-0 top-0
				h-full w-full opacity-50 transition-all group-hover:opacity-80"
			></div>
			<Image
				src="/design/tourn_cup.png"
				alt="Cup Icon"
				width={490}
				quality={100}
				height={490}
				className="-bottom-45 duration-800 group-hover:scale-102 absolute -right-16 hidden transition-all group-hover:-translate-y-3
				md:block lg:-right-10"
			/>
		</motion.div>
	);
}

export default Banner;
