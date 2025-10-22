"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const ConnectionRefused = () => {
    const query = useSearchParams();

    return (
        <motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<article className="bg-card border-br-card gap-4 flex flex-col h-full w-full justify-center rounded-2xl border-2">
                <Image
                    src={'/design/dead-robot.png'}
                    alt={'Disconnected'}
                    width={300}
                    height={300}
                    quality={100}
                    className="opacity-60 border border-red-500"
                />
                <span className="text-6xl opacity-60">{query.get('reason') || 'Somthing went wrong'}</span>
			</article>
		</motion.main>
    )
}

export default ConnectionRefused;