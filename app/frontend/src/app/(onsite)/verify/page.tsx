'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainCardWrapper from '../components/UI/MainCardWrapper';
import Overview from './Overview';
import VerifyPhone from './VerifyPhone';

enum STEP {
	OVERVIEW = 'OVERVIEW',
	REQUEST_STEUP = 'REQUEST_SETUP',
	VERIFY_SETUP = 'VERIFY_SETUP',
	DONE = 'DONE'
}

export default function VerifyPage() {

	return (
		<>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<MainCardWrapper className="h-full w-full custom-scrollbar font-funnel-display">
					<div className="h-full w-full flex justify-center items-center overflow-auto px-4 py-16">
						<VerifyPhone />
					</div>
				</MainCardWrapper>
			</motion.main>
		</>
	);
}
