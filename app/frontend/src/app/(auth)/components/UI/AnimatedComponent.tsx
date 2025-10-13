'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedComponent({ children, componentKey, className }: { children: React.ReactNode, componentKey: string, className: string }) {
	return (
		<motion.main
			key={componentKey}
			initial={{ opacity: 0, x: -5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -5 }}
			transition={{ duration: 0.8, delay: 0 }}
			className={className}
		>
			{children}
		</motion.main>
	);
}
