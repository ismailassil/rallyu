'use client';
import { useState } from "react";
import FormFieldAvailability from "./FormFieldAvailability";
import FormFieldError from "./FormFieldError";
import PasswordStrength from "./PasswordStrength";
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
	touch: boolean;
	error?: string;
	debounced: boolean;
	setFieldAvailable?: (name: string, available: boolean) => void;
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
	touch, 
	error, 
	debounced, 
	setFieldAvailable 
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
				{hidden && 
					<Image alt='Hide Password' 
						src	={!inputHidden ? '/icons/eye.svg' : '/icons/eye-slash-light.svg' } 
						width={!inputHidden ? 18.5 : 20} 
						height={!inputHidden ? 18.5 : 20}
						onClick={handleToggleShowInput}
					></Image>
				}
			</div>
			<AnimatePresence>
				{ field === 'password' && touch && inputValue && <PasswordStrength value={inputValue} /> }
				{ debounced && touch && error && <FormFieldError key="1" error={error} /> }
				{ (field === 'username' || field === 'email') && debounced && touch && !error && inputValue && inputValue.length >= 3 && 
						<FormFieldAvailability key="2" setFieldAvailable={setFieldAvailable}
							label={label}
							name={field}
							value={inputValue}
						/>
				}
			</AnimatePresence>
		</div>
	);
};

export default FormField;
