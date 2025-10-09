'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function AuthPageWrapper({ children, wrapperKey }: { children: React.ReactNode, wrapperKey: string }) {
	return (
		<motion.main
			key={wrapperKey}
			initial={{ opacity: 0, x: -5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -5 }}
			transition={{ duration: 0.8, delay: 0 }}
			className="w-full h-full flex justify-center items-center"
		>
			{children}
		</motion.main>
	);
}
