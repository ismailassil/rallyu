import SettingsCard from "../../SettingsCard";
import { Fingerprint, Check, LoaderCircle, X } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sessions from "./Sessions";
import { motion } from 'framer-motion';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function SecuritySettingsTab() {
	const t = useTranslations('settings.security.cards');

	const router = useRouter();
	const changePasswordFormId = 'change-password-form';
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [buttonHidden, setButtonHidden] = useState(true);

	const {
		loggedInUser
	} = useAuth();

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			{loggedInUser!.auth_provider === 'Local' && (
				<>
				<SettingsCard
					title={t('twoFactor.title')}
					subtitle={t('twoFactor.subtitle')}
					actionLabel={t('twoFactor.button')}
					actionIcon={<Fingerprint size={16} />}
					onAction={() => router.push('/2fa-manager')}
				>
				</SettingsCard>
				<SettingsCard
					title={t('change_password_form.title')}
					subtitle={t('change_password_form.subtitle')}
					actionIcon={buttonDisabled ? <LoaderCircle size={16} className='animate-spin' /> : <Check size={16} />}
					formId={changePasswordFormId}
					isButtonDisabled={buttonDisabled}
					isButtonHidden={buttonHidden}
					isFoldable={true}
					defaultExpanded={false}
				>
					<ChangePasswordForm
						formId={changePasswordFormId}
						setButtonDisabled={setButtonDisabled}
						setButtonHidden={setButtonHidden}
					/>
				</SettingsCard>
				</>
			)}
			<SettingsCard
				title={t('sessions.title')}
				subtitle={t('sessions.subtitle')}
			>
				<Sessions />
			</SettingsCard>
			<SettingsCard
				title={t('delete_account.title')}
				subtitle={t('delete_account.subtitle')}
				actionLabel={t('delete_account.button')}
				actionIcon={<X size={16} />}
				isButtonHidden={false}
				isButtonDisabled={false}
				onAction={() => router.push('/delete-account')}
			>

			</SettingsCard>
		</motion.div>
	);
}
