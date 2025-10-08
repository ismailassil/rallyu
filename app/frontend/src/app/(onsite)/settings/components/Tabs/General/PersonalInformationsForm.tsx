import React from 'react';
import InputField from '@/app/(auth)/components/shared/form/InputField';
import LanguageSwitcher from '../../items/LanguageSwitcher';
import { useFormContext } from '@/app/(auth)/components/shared/form/FormContext';
import AvailabilityIndicator from '@/app/(auth)/components/shared/form/AvailabilityIndicator';
import { AvailabilityStatus } from '@/app/hooks/useAvailabilityCheck';

interface PersonalInformationsFormProps {
	usernameStatus: AvailabilityStatus,
	emailStatus: AvailabilityStatus,
}

export default function PersonalInformationsForm({ usernameStatus, emailStatus } : PersonalInformationsFormProps) {
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
					label='First Name'
					field='first_name'
					inputPlaceholder='Achraf'
				/>
				<InputField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/lastname.svg'
					label='Last Name'
					field='last_name'
					inputPlaceholder='Demnati'
				/>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label='Username'
					field='username'
					inputPlaceholder='xezzuz'
				>
					{debounced.username && !errors.username && <AvailabilityIndicator key="username-availability" label='Username' status={usernameStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/mail.svg'
					label='Email'
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
				>
					{debounced.email && !errors.email && <AvailabilityIndicator key="email-availability" label='Email' status={emailStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/note.svg'
					label='Bio'
					field='bio'
					inputPlaceholder='DFK'
				/>
			</div>
			<LanguageSwitcher />
		</div>
	);
}