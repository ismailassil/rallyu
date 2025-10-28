import React, { useEffect, useState } from 'react'
import SettingsCard from '../../../SettingsCard';
import { ServerOff, TriangleAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

function ClearLocalDataModal({ onCloseModal }: { onCloseModal: () => void }) {
	const t = useTranslations('settings.security.cards.clear_local_data.modal');

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onCloseModal();
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [onCloseModal]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
			onClick={onCloseModal}
		>
			<div
				className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-white/8 overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-6 sm:p-8">
					<div className="flex items-center gap-3 mb-8">
						<div className="p-3 bg-blue-500/20 rounded-xl">
							<ServerOff className="text-blue-400" size={24} />
						</div>
						<h2 id="modal-title" className="text-2xl font-bold text-white">
							{t('title')}
						</h2>
					</div>

					<div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-5">
						<p className="text-gray-300 leading-relaxed">
							{t('text1')} <span className="text-blue-400 font-semibold">{t('text2')}</span> {t('text3')}
						</p>
						<p className="text-blue-400 font-bold mt-3 text-base flex items-center gap-1">
							<TriangleAlert size={16} /> {t('warning1')}
						</p>
						<p className="text-blue-400 font-bold mt-3 text-base flex items-center gap-1">
							<TriangleAlert size={16} /> {t('warning2')}
						</p>
					</div>

					<div className="flex w-full mt-8 gap-4">
						<button
							className="flex-1 bg-white/4 hover:bg-white/10 border border-white/10
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium transition-all duration-500 ease-in-out cursor-pointer"
							onClick={onCloseModal}
						>
							{t('button1')}
						</button>
						<button
							className="flex-1 bg-blue-500/10 hover:bg-blue-500/60 border border-blue-500/20 text-white
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium transition-all duration-500 ease-in-out cursor-pointer"
							onClick={() => alert('DEV - CLEAR LOCAL DATA')}
						>
							{t('button2')}
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default function ClearLocalDataSettingCard() {
	const t = useTranslations('settings.security.cards.clear_local_data');
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
		<SettingsCard
			title={t('title')}
			subtitle={t('subtitle')}
			actionButtonOptions={{
				title: t('button'),
				icon: <ServerOff size={16} />,
				onClick: () => setIsModalOpen(true)
			}}
		>
		</SettingsCard>
		<AnimatePresence>
			{isModalOpen && <ClearLocalDataModal onCloseModal={() => setIsModalOpen(false)} />}
		</AnimatePresence>
		</>
	);
}
