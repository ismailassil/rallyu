'use client';
import { useState } from "react";
import FormFieldError from "./InputFieldError";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

type FormFieldProps = {
	className?: string;
	iconSrc: string;
	label: string;
	field: string;
	// inputType: string;
	inputPlaceholder?: string;
	inputValue: string;
	hidden?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	touched: boolean;
	error?: string;
	debounced: boolean;
	children?: React.ReactNode;
};

function FormField({ 
	className, 
	iconSrc, 
	label, 
	field, 
	inputPlaceholder, 
	inputValue, 
	hidden, 
	onChange, 
	touched, 
	error, 
	debounced, 
	children
} : FormFieldProps) {

	const [inputHidden, setInputHidden] = useState(hidden);

	function handleToggleShowInput() {
		setInputHidden(!inputHidden);
	}

	return (
		<div className={className}>
			<label htmlFor={field}>{label}</label>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
				<Image alt={label} src={iconSrc} width={20} height={20}></Image>
				<input 
					id={field} 
					name={field} 
					type={inputHidden ? 'password' : 'text'}
					placeholder={inputPlaceholder}
					className='outline-none flex-1 overflow-hidden' 
					value={inputValue}
					onChange={onChange}
				/>
				{ hidden && 
					<Image alt='Hide Password' 
						src	={!inputHidden ? '/icons/eye-slash-light.svg' : '/icons/eye.svg' } 
						width={!inputHidden ? 20 : 18.5} 
						height={!inputHidden ? 20 : 18.5}
						onClick={handleToggleShowInput}
						className="cursor-pointer"
					></Image>
				}
			</div>
			<AnimatePresence>
				{children}
				{debounced && touched && error && <FormFieldError error={error} />}
			</AnimatePresence>
		</div>
	);
};

export default FormField;
