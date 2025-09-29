'use client';
import React from 'react';
import { useAuth } from '../(onsite)/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

export default function BackgroundManager() {
	const { isAuthenticated, isLoading } = useAuth();

	return (
		<div className='fixed top-0 left-0 h-screen w-screen -z-[1000] pointer-events-none'>
			<AnimatePresence>
				{isAuthenticated ? (
					<motion.div
						key="main"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 2, ease: "easeInOut" }}
						className="background-main min-h-screen min-w-screen"
					/>
				) : (
					<motion.div
						key="auth"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 2, ease: "easeInOut" }}
						className="background-auth min-h-screen min-w-screen"
					/>
				)}
			</AnimatePresence>
			{/* {isLoading && (
				<div className="absolute inset-0 flex items-center justify-center backdrop-blur-3xl transition-all duration-1000">
					<Loader width={16} height={16} className='animate-spin' />
				</div>
			)} */}
			<AnimatePresence>
				{isLoading && (
					<motion.div
						key="loader-overlay"
						initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
						animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
						exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
						transition={{ duration: 2, ease: 'easeInOut' }}
						className="absolute inset-0 pointer-events-auto"
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{isLoading && (
					<motion.div
						key="loader"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<Loader width={16} height={16} className='animate-spin' />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
