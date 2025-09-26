import React, { ChangeEvent } from 'react';
import FormField from '@/app/(auth)/signup/components/FormField';
import LanguageSwitcher from '../items/LanguageSwitcher';
import FormFieldAvailability from '@/app/(auth)/signup/components/FormFieldAvailability';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

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
		<div className="flex flex-col gap-4">
			<form id='settings-personal-info-form' action="" className='flex flex-col gap-5'>
				<FormField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/firstname.svg'
					label='First Name'
					field='first_name'
					inputPlaceholder={formData.first_name}
					inputValue={formData.first_name}
					onChange={onChange}
					touched={touched.first_name}
					error={errors.first_name}
					debounced={debounced.first_name}
				/>
				<FormField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/lastname.svg'
					label='Last Name'
					field='last_name'
					inputPlaceholder={formData.last_name}
					inputValue={formData.last_name}
					onChange={onChange}
					touched={touched.last_name}
					error={errors.last_name}
					debounced={debounced.last_name}
				/>
				<FormField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label='Username'
					field='username'
					inputPlaceholder={formData.username}
					inputValue={formData.username}
					onChange={onChange}
					touched={touched.username}
					error={errors.username}
					debounced={debounced.username}
				>
					{(formData.username !== loggedInUser?.username) && debounced.username && touched.username && !errors.username && formData.username && formData.username.length >= 3 && (
						<FormFieldAvailability 
							label='Username'
							name='username'
							value={formData.username}
							setFieldAvailable={setFieldAvailable}
						/>
					)}
				</FormField>
				<FormField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/mail.svg'
					label='Email'
					field='email'
					inputPlaceholder={formData.email}
					inputValue={formData.email}
					onChange={onChange}
					touched={touched.email}
					error={errors.email}
					debounced={debounced.email}
				>
					{(formData.username !== loggedInUser?.username) && debounced.email && touched.email && !errors.email && formData.email && formData.email.length >= 3 && (
						<FormFieldAvailability 
							label='Email'
							name='email'
							value={formData.email}
							setFieldAvailable={setFieldAvailable}
						/>
					)}
				</FormField>
				<FormField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/note.svg'
					label='Bio'
					field='bio'
					inputPlaceholder={formData.bio}
					inputValue={formData.bio}
					onChange={onChange}
					touched={touched.bio}
					error={errors.bio}
					debounced={debounced.bio}
				/>
			</form>
			<LanguageSwitcher />
		</div>
	);
}