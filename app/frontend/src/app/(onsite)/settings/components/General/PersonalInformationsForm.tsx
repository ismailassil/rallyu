import React, { ChangeEvent } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import FormField from '@/app/(auth)/signup/components/FormField';

// interface FormFieldProps {
// 	field: keyof FormDataState;
// 	label: string;
// 	placeholder: string;
// 	iconSrc: string;
// 	value: string;
// 	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// function FormField({ field, label, placeholder, iconSrc, value, onChange }: FormFieldProps) {
// 	return (
// 		<div className="field flex flex-col gap-0.5 box-border flex-1">
// 			<label htmlFor={field}>{label}</label>
// 			<div className="flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg border border-white/10">
// 				<Image alt={label} src={iconSrc} width={20} height={20} />
// 				<input
// 					id={field}
// 					name={field}
// 					type="text"
// 					placeholder={placeholder}
// 					className="outline-none flex-1 overflow-hidden"
// 					value={value}
// 					onChange={onChange}
// 				/>
// 			</div>
// 		</div>
// 	);
// }

interface PersonalInformationsFormProps {
	formData: Record<string, string>;
	touched: Record<string, boolean>;
	errors: Record<string, string>;
	debounced: Record<string, boolean>;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalInformationsForm({ 
	formData,
	touched,
	errors,
	debounced,
	onChange
}: PersonalInformationsFormProps) {
	return (
		<div className="flex flex-col gap-4">
			<FormField
				className='field flex flex-col gap-0.5 min-w-0 flex-1'
				iconSrc='/icons/firstname.svg'
				label='First Name'
				field='fname'
				inputPlaceholder={formData.fname}
				inputValue={formData.fname}
				onChange={onChange}
				touch={touched.fname}
				error={errors.fname}
				debounced={debounced.fname}
			/>
			<FormField
				className='field flex flex-col gap-0.5 min-w-0 flex-1'
				iconSrc='/icons/lastname.svg'
				label='Last Name'
				field='lname'
				inputPlaceholder={formData.lname}
				inputValue={formData.lname}
				onChange={onChange}
				touch={touched.lname}
				error={errors.lname}
				debounced={debounced.lname}
			/>
			<FormField
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/at.svg'
				label='Username'
				field='username'
				inputPlaceholder={formData.username}
				inputValue={formData.username}
				onChange={onChange}
				touch={touched.username}
				error={errors.username}
				debounced={debounced.username}
				// availabilityChecked={false}
				// setFieldAvailable={updateFieldAvailable}
				/>
			<FormField
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/mail.svg'
				label='Email'
				field='email'
				inputPlaceholder={formData.email}
				inputValue={formData.email}
				onChange={onChange}
				touch={touched.email}
				error={errors.email}
				debounced={debounced.email}
				// availabilityChecked={false}
				// setFieldAvailable={updateFieldAvailable}
			/>
			<FormField
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/mail.svg'
				label='Bio'
				field='bio'
				inputPlaceholder={formData.bio}
				inputValue={formData.bio}
				onChange={onChange}
				touch={touched.bio}
				error={errors.bio}
				debounced={debounced.bio}
				// setFieldAvailable={updateFieldAvailable}
			/>
		</div>
	);
}