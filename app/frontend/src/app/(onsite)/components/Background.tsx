'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnsiteBackground({ children } : Readonly<{ children?: React.ReactNode }>) {
	return (
		<div className='min-h-screen min-w-screen fixed top-0 left-0 -z-[1000]'>
			<AnimatePresence>
				<motion.div 
					initial={{ opacity: 0, filter: 'blur(2px)' }}
					animate={{ opacity: 1, filter: 'blur(0px)' }}
					exit={{ opacity: 0, filter: 'blur(2px)' }}
					transition={{ duration: 2, ease: "easeInOut" }}
					className='background-main min-h-screen min-w-screen'
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
