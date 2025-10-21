'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AuthPageWrapper({ children, wrapperKey }: { children: React.ReactNode, wrapperKey: string }) {
	const [isSize, setIsSize] = useState(false);

	useEffect(() => {
		function handleResize() {
			if (window.innerHeight < 940){
				setIsSize(true);
			} else {
				setIsSize(false);
			}
		}

		window.addEventListener('resize', handleResize);

		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	

	return (
		<motion.main
			key={wrapperKey}
			initial={{ opacity: 0, x: -5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -5 }}
			transition={{ duration: 0.8, delay: 0 }}
			className={`w-full h-full flex justify-center ${!isSize ? "items-center mt-0" : "items-start mt-20"}`}
		>
			{children}
		</motion.main>
	);
}
