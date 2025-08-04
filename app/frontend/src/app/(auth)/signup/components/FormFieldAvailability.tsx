import { LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import SlideInOut from "./SlideInOut";

type FieldStatus = 'CHECKING' | 'AVAILABLE' | 'TAKEN' | 'ERROR' | null;

type FormFieldAvailabilityProps = {
	label: string;
	name: string;
	value: string;
	setFieldAvailable?: (name: string, available: boolean) => void;
};

function getFieldStatusDisplay(label: string, fieldStatus: FieldStatus) {
	switch (fieldStatus) {
		case 'CHECKING':
			return { message: 'Checking availability...', icon: <LoaderCircle className="animate-spin" size={14}/>, color: 'text-blue-400'};
		case 'AVAILABLE':
			return { message: `${label} is available!`, icon: <CheckCircle2 size={14}/>, color: 'text-green-400'};
		case 'TAKEN':
			return { message: `${label} is already taken!`, icon: <AlertCircle size={14} className="shrink-0"/>, color: 'text-red-400'};
		case 'ERROR':
			return { message: `${label} checking failed!`, icon: <AlertCircle size={14} className="shrink-0"/>, color: 'text-red-400'};
	}
}

async function checkFormFieldAvailability(name: string, value: string) {
	try {
		const response = await fetch(`http://localhost:4000/users/available?${name}=${value}`, {
			method: 'GET'
		});
		
		const isAvailable = response.ok ? true : false;
		
		return isAvailable;
	} catch {
		return null;
	}
}

export default function FormFieldAvailability({
	label,
	name,
	value,
	setFieldAvailable
}: FormFieldAvailabilityProps) {
	const [fieldStatus, setFieldStatus] = useState<FieldStatus>(null);

	useEffect(() => {
			setFieldStatus('CHECKING');

			async function check(name: string, value: string) {
				const isAvailable = await checkFormFieldAvailability(name, value);
				if (isAvailable === true) {
					setFieldStatus('AVAILABLE');
					setFieldAvailable?.(name, true);
				} else if (isAvailable === false) {
					setFieldStatus('TAKEN');
					setFieldAvailable?.(name, false);
				} else {
					setFieldStatus('ERROR');
					setFieldAvailable?.(name, false);
				}
			}

			check(name, value);
	}, [name, value, setFieldAvailable]);

	const fieldStatusDisplay = getFieldStatusDisplay(label, fieldStatus);
	console.log('fieldStatusDisplay', fieldStatusDisplay);

	if (!fieldStatusDisplay) return null;

	console.log(`rendring FormFieldAvailability`);
	return (
		<SlideInOut>
			<div className={`${fieldStatusDisplay.color} font-light text-xs flex items-center p-1 gap-1.5`}>
				<span>{fieldStatusDisplay.icon}</span>
				<p>{fieldStatusDisplay.message}</p>
			</div>
		</SlideInOut>
	);
}
