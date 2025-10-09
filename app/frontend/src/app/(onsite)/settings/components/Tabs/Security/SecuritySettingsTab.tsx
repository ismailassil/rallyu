import SettingsCard from "../../SettingsCard";
import { Fingerprint, Check, LoaderCircle, X } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Sessions from "./Sessions";
import { motion } from 'framer-motion';

export default function SecuritySettingsTab() {
	const router = useRouter();
	const changePasswordFormId = 'change-password-form';
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [buttonHidden, setButtonHidden] = useState(true);

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			<SettingsCard 
				title="Two-factor Authentication"
				subtitle="Add an extra layer of security to your account by choosing your preferred verification method"
				actionLabel='Manage 2FA'
				actionIcon={<Fingerprint size={16} />}
				onAction={() => router.push('/2fa')}
			>
			</SettingsCard>
			<SettingsCard 
				title="Change Password"
				subtitle="Modify your current password"
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
			<SettingsCard 
				title="Browsers and devices"
				subtitle="These browsers and devices are currently signed in to you account. Remove any unauthorized devices"
			>
				<Sessions />
			</SettingsCard>
			<SettingsCard 
				title="Delete Account"
				subtitle="This will permanently delete your account and all associated data. This action is irreversible"
				actionLabel='Delete Account'
				actionIcon={<X size={16} />}
				isButtonHidden={false}
				isButtonDisabled={false}
				onAction={() => router.push('/delete-account')}
			>
				
			</SettingsCard>
		</motion.div>
	);
}
