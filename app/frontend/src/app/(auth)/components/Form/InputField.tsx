'use client';
import { HTMLInputTypeAttribute, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useFormContext } from './FormContext';
import InputFieldError from './InputFieldError';

type InputFieldProps = {
	className?: string;
	iconSrc: string;
	label: string;
	field: string;
	inputPlaceholder?: string;
	inputHidden?: boolean;
	type?: HTMLInputTypeAttribute;
	children?: React.ReactNode;
};

function InputField({ 
	className, 
	iconSrc, 
	label, 
	field, 
	inputPlaceholder, 
	inputHidden = false, 
	type = 'text',
	children
} : InputFieldProps) {
	const { formData, errors, debounced, handleChange } = useFormContext();
	const [isInputHidden, setIsInputHidden] = useState(inputHidden);

	function handleToggleShowInput() {
		setIsInputHidden(!isInputHidden);
	}

	return (
		<div className={className}>
			<label htmlFor={field}>{label}</label>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
				<Image alt={label} src={iconSrc} width={20} height={20}></Image>
				<input 
					id={field} 
					name={field} 
					type={isInputHidden ? 'password' : type}
					placeholder={inputPlaceholder}
					className='outline-none flex-1 overflow-hidden' 
					value={formData[field] || ''}
					onChange={handleChange}
				/>
				{inputHidden && 
					<Image 
						alt='Hide Password' 
						src={isInputHidden ? '/icons/eye.svg' : '/icons/eye-slash-light.svg'}
						width={!isInputHidden ? 20 : 18.5} 
						height={!isInputHidden ? 20 : 18.5}
						onClick={handleToggleShowInput}
						className="cursor-pointer"
					/>
				}
			</div>
			<AnimatePresence>
				{debounced[field] && errors[field] && <InputFieldError error={errors[field]} />}
				{children}
			</AnimatePresence>
		</div>
	);
};

export default InputField;