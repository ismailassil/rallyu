import React, { useEffect, useState } from 'react'
import SettingsCard from '../../../SettingsCard';
import { Trash2, TriangleAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

function DeleteAccountModal({ onCloseModal } : { onCloseModal: () => void }) {
	const t = useTranslations('settings.security.cards.delete_account.modal');

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
				{/* CONTENT */}
				<div className="p-6 sm:p-8">
					<div className="flex items-center gap-3 mb-8">
						<div className="p-3 bg-red-500/20 rounded-xl">
							<Trash2 className="text-red-400" size={24} />
						</div>
						<h2 id="modal-title" className="text-2xl font-bold text-white">
							{t('title')}
						</h2>
					</div>

					<div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
						<p className="text-gray-300 leading-relaxed">
							{t('text1')} <span className="text-red-400 font-semibold">{t('text2')}</span> {t('text3')} <br></br>{t('text4')} <code className="text-gray-400">{t('text5')}</code>.
						</p>
						<p className="text-red-400 font-bold mt-3 text-base flex items-center gap-1">
							<TriangleAlert size={16} /> {t('warning1')}
						</p>
						<p className="text-red-400 font-bold mt-3 text-base flex items-center gap-1">
							<TriangleAlert size={16} /> {t('warning2')}
						</p>
					</div>

					{/* ACTION BUTTONS */}
					<div className='flex w-full mt-8 gap-4'>
						<button className='flex-1 bg-white/4 hover:bg-white/10 border border-white/10
										flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
										rounded-full h-10 select-none font-medium
										transition-all duration-500 ease-in-out cursor-pointer'
								onClick={onCloseModal}
						>
							{t('button1')}
						</button>
						<button className='flex-1 bg-red-500/10 hover:bg-red-500/60 border border-red-500/20 text-white
										flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
										rounded-full h-10 select-none font-medium
										transition-all duration-500 ease-in-out cursor-pointer'
								onClick={() => alert('DEV - DELETE ACCOUNT')}
						>
							{t('button2')}
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}


export default function DeleteAccountSettingCard() {
	const t = useTranslations('settings.security.cards.delete_account');
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
		<SettingsCard
			title={t('title')}
			subtitle={t('subtitle')}
			actionButtonOptions={{
				title: t('button'),
				icon: <Trash2 size={16} />,
				onClick: () => setIsModalOpen(true)
			}}
		>
		</SettingsCard>
		<AnimatePresence>
			{isModalOpen && <DeleteAccountModal onCloseModal={() => setIsModalOpen(false)} />}
		</AnimatePresence>
		</>
	);
}
