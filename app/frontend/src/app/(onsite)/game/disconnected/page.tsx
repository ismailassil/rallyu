"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const ConnectionRefused = () => {
    const query = useSearchParams();
    const reason = query.get('reason') || 'Somthing went wrong';

    console.log('Reason: ', reason);

    return (
        <motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<article className="bg-card border-br-card flex p-10 flex-col h-full w-full justify-center items-center rounded-2xl border-2">
                <Image
                    src={'/design/dead-robot.png'}
                    alt={'Disconnected'}
                    width={300}
                    height={300}
                    quality={100}
                    className="opacity-60"
                />
                <span className="max-w-[1000px] h-auto text-center break-words whitespace-pre-line text-3xl lg:text-4xl font-funnel-display font-bold opacity-60">
                    {reason}
                </span>
			</article>
		</motion.main>
    )
}

export default ConnectionRefused;