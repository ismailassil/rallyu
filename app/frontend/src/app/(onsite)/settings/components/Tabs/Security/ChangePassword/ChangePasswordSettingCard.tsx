import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SettingsCard from "../../../SettingsCard";
import { Lock } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import ChangePasswordForm from "./ChangePasswordForm";

function ChangePasswordModal({ onCloseModal } : { onCloseModal: () => void }) {
	const t = useTranslations('settings.security.cards.change_password.modal');

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
					<div className="flex items-center gap-3 mb-16">
						<div className="p-3 bg-blue-500/20 rounded-xl">
							<Lock className="text-blue-400" size={24} />
						</div>
						<h2 id="modal-title" className="text-2xl font-bold text-white">
							{t('title')}
						</h2>
					</div>
					<ChangePasswordForm
						onSuccess={onCloseModal}
						onCancel={onCloseModal}
					/>
				</div>
			</div>
		</motion.div>
	);
}

export default function ChangePasswordSettingCard() {
	const t = useTranslations('settings.security.cards.change_password');
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
		<SettingsCard
			title={t('title')}
			subtitle={t('subtitle')}
			actionButtonOptions={{
				title: t('button'),
				icon: <Lock size={16} />,
				onClick: () => setIsModalOpen(true)
			}}
		>
		</SettingsCard>
		<AnimatePresence>
			{isModalOpen && <ChangePasswordModal onCloseModal={() => setIsModalOpen(false)} />}
		</AnimatePresence>
		</>
	);
}
