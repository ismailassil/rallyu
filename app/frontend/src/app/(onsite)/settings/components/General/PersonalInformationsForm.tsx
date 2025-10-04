import React, { ChangeEvent } from 'react';
import InputField from '@/app/(auth)/components/shared/form/InputField';
import LanguageSwitcher from '../items/LanguageSwitcher';
import FormFieldAvailability from '@/app/(auth)/components/shared/form/FormFieldAvailability';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { FormProvider } from '@/app/(auth)/components/shared/form/FormContext';

interface PersonalInformationsFormProps {
	formData: Record<string, string>;
	touched: Record<string, boolean>;
	errors: Record<string, string>;
	debounced: Record<string, boolean>;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	setFieldAvailable?: (name: string, available: boolean) => void;
}

export default function PersonalInformationsForm({ 
	formData,
	touched,
	errors,
	debounced,
	onChange,
	setFieldAvailable
} : PersonalInformationsFormProps) {
	const { loggedInUser } = useAuth();
	return (
		<FormProvider
			formData={formData}
			touched={touched}
			errors={errors}
			debounced={debounced}
			handleChange={onChange}
			validateAll={() => true} // Placeholder for this form
		>
			<div className="flex flex-col gap-4">
				<div className='flex flex-col gap-5'>
					<InputField
						className='field flex flex-col gap-0.5 min-w-0 flex-1'
						iconSrc='/icons/firstname.svg'
						label='First Name'
						field='first_name'
						inputPlaceholder={formData.first_name}
					/>
					<InputField
						className='field flex flex-col gap-0.5 min-w-0 flex-1'
						iconSrc='/icons/lastname.svg'
						label='Last Name'
						field='last_name'
						inputPlaceholder={formData.last_name}
					/>
					<InputField
						className='field flex flex-col gap-0.5 box-border'
						iconSrc='/icons/at.svg'
						label='Username'
						field='username'
						inputPlaceholder={formData.username}
					>
						{(formData.username !== loggedInUser?.username) && debounced.username && touched.username && !errors.username && formData.username && formData.username.length >= 3 && (
							<FormFieldAvailability 
								label='Username'
								name='username'
								value={formData.username}
								setFieldAvailable={setFieldAvailable}
							/>
						)}
					</InputField>
					<InputField
						className='field flex flex-col gap-0.5 box-border'
						iconSrc='/icons/mail.svg'
						label='Email'
						field='email'
						inputPlaceholder={formData.email}
					>
						{(formData.email !== loggedInUser?.email) && debounced.email && touched.email && !errors.email && formData.email && formData.email.length >= 3 && (
							<FormFieldAvailability 
								label='Email'
								name='email'
								value={formData.email}
								setFieldAvailable={setFieldAvailable}
							/>
						)}
					</InputField>
					<InputField
						className='field flex flex-col gap-0.5 box-border'
						iconSrc='/icons/note.svg'
						label='Bio'
						field='bio'
						inputPlaceholder={formData.bio}
					/>
				</div>
				<LanguageSwitcher />
			</div>
		</FormProvider>
	);
}