import { motion } from "framer-motion";
import Image from "next/image";
import SettingsCard from "../SettingsCard";
import { XIcon, Fingerprint, Smartphone, Mail, Check, Laptop, MapPin, Clock, Trash2, Monitor, LoaderCircle, LogOut } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";
import TwoFactorAuth from "./TwoFactorAuth";
import { useRouter } from "next/navigation";
import { string } from "zod";
import { changePasswordSchema } from "@/app/(api)/schema";
import useForm from "@/app/hooks/useForm";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { useState } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import Sessions from "./Sessions";

export default function Security() {
	const router = useRouter();
	const { apiClient } = useAuth();
	const changePasswordFormId = 'change-password-form';
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [buttonHidden, setButtonHidden] = useState(true);

	return (
		<motion.div
			initial={{ opacity: 0, x: 5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -5 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex flex-col gap-4'>
				{/* <TwoFactorAuth /> */}
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
					onAction={() => router.push('/logout-from-all')}
					actionLabel='Sign out from all devices'
					actionIcon={<LogOut size={16} />}
				>
					<Sessions />
				</SettingsCard>
				<SettingsCard 
					title="Delete Account"
					subtitle="This will permanently delete your account and all associated data. This action is irreversible"
					actionLabel='Delete Account'
					isButtonHidden={false}
					isButtonDisabled={false}
					onAction={() => router.push('/delete-account')}
				>
					
				</SettingsCard>
			</div>
		</motion.div>
	);
}
