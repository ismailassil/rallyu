import React from 'react';
import InputField from '@/app/(auth)/components/Form/InputField';
import LanguageSwitcher from '../../items/LanguageSwitcher';
import { useFormContext } from '@/app/(auth)/components/Form/FormContext';
import AvailabilityIndicator from '@/app/(auth)/components/Form/AvailabilityIndicator';
import { AvailabilityStatus } from '@/app/hooks/useAvailabilityCheck';
import { useTranslations } from 'next-intl';

interface PersonalInformationsFormProps {
	usernameStatus: AvailabilityStatus,
	emailStatus: AvailabilityStatus,
}

export default function PersonalInformationsForm({ usernameStatus, emailStatus } : PersonalInformationsFormProps) {
	const t = useTranslations('auth.common');

	const {
		errors,
		debounced
	} = useFormContext();

	return (
		<div className="flex flex-col gap-4">
			<div className='flex flex-col gap-5'>
				<InputField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/firstname.svg'
					label={t('first_name')}
					field='first_name'
					inputPlaceholder='Achraf'
				/>
				<InputField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/lastname.svg'
					label={t('last_name')}
					field='last_name'
					inputPlaceholder='Demnati'
				/>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label={t('username')}
					field='username'
					inputPlaceholder='xezzuz'
				>
					{debounced.username && !errors.username && <AvailabilityIndicator key="username-availability" label='Username' status={usernameStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/mail.svg'
					label={t('email')}
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
				>
					{debounced.email && !errors.email && <AvailabilityIndicator key="email-availability" label='Email' status={emailStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/note.svg'
					label={t('bio')}
					field='bio'
					inputPlaceholder='DFK'
				/>
			</div>
			<LanguageSwitcher />
		</div>
	);
}
