import SettingsCard from "../../SettingsCard";
import { Fingerprint, LoaderCircle, X, Lock, CircleOff, Save } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Sessions from "./Sessions";
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function SecuritySettingsTab() {
	const router = useRouter();

	const t = useTranslations('settings.security.cards');

	const changePasswordFormRef = useRef<HTMLFormElement | null>(null);
	const changePasswordCardRef = useRef<any | null>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [canSave, setCanSave] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		loggedInUser
	} = useAuth();

	function expandCard() {
		setIsEditing(true);
		changePasswordCardRef.current?.expand();
	}
	function collapseCard() {
		setIsEditing(false);
		changePasswordCardRef.current?.collapse();
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			{loggedInUser!.auth_provider === 'Local' && (
				<>
					<SettingsCard
						title={t('twoFactor.title')}
						subtitle={t('twoFactor.subtitle')}
						actionButtonOptions={{
							title: t('twoFactor.button'),
							icon: <Fingerprint size={16} />,
							onClick: () => router.push('2fa-manager')
						}}
					/>
					<SettingsCard
						ref={changePasswordCardRef}
						title={t('change_password_form.title')}
						subtitle={t('change_password_form.subtitle')}
						actionButtonOptions={{
							title: 'Change Password',
							icon: isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : isEditing ? (canSave ? <Save size={16} /> : <CircleOff size={16} />) : <Lock size={16} /> ,
							iconKey: isSubmitting ? 'loader' : isEditing ? (canSave ? 'check-check' : 'x') : 'lock' ,
							onClick: isEditing ? (canSave ? () => changePasswordFormRef.current?.requestSubmit() : collapseCard) : expandCard,
							disabled: isSubmitting
						}}
						defaultExpanded={false}
					>

							<ChangePasswordForm
								formRef={changePasswordFormRef}
								setCanSave={(bool) => setCanSave(bool)}
								setIsSubmitting={(bool) => setIsSubmitting(bool)}
								onSuccess={() => setIsEditing(false)}
							/>

					</SettingsCard>
				</>
			)}
			<SettingsCard
				title={t('sessions.title')}
				subtitle={t('sessions.subtitle')}
				initialHeight='loading'
			>
				<Sessions />
			</SettingsCard>
			<SettingsCard
				title={t('delete_account.title')}
				subtitle={t('delete_account.subtitle')}
				actionButtonOptions={{
					title: 'Delete Account',
					icon: <X size={16} />
				}}
			>
			</SettingsCard>
		</motion.div>
	);
}
