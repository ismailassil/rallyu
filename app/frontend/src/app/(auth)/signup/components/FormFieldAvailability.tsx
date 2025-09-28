import { LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import SlideInOut from "./SlideInOut";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

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

export default function FormFieldAvailability({
	label,
	name,
	value,
	setFieldAvailable
} : FormFieldAvailabilityProps) {
	const [fieldStatus, setFieldStatus] = useState<FieldStatus>(null);
	const { loggedInUser, isAuthenticated, isLoading, apiClient } = useAuth();

	useEffect(() => {
			setFieldStatus('CHECKING');
			async function fetchAvailability(name: string, value: string) {
				let isAvailable: boolean | null = null;

				try {
					if (name === 'username') isAvailable = await apiClient?.isUsernameAvailable(value.trim());
					else if (name === 'email') isAvailable = await apiClient?.isEmailAvailable(value.trim());
					setFieldStatus(isAvailable === true ? 'AVAILABLE' : isAvailable === false ? 'TAKEN' : 'ERROR');
					setFieldAvailable?.(name, isAvailable === true);
				} catch {
					setFieldStatus('ERROR');
					setFieldAvailable?.(name, false);
				}
			}
			// if (!isLoading) {
			// 	if (isAuthenticated && ((name == 'username' && loggedInUser?.username == value.trim()) || (name == 'email' && loggedInUser?.email == value.trim()))) {
			// 		setFieldStatus(null);
			// 		setFieldAvailable?.(name, true);
			// 	}
			// 	else
			// }
			fetchAvailability(name, value);

	}, [name, value]);

	const fieldStatusDisplay = getFieldStatusDisplay(label, fieldStatus);

	if (!fieldStatusDisplay) return null;

	return (
		<SlideInOut>
			<div className={`${fieldStatusDisplay.color} font-light text-xs flex items-center p-1 gap-1.5`}>
				<span>{fieldStatusDisplay.icon}</span>
				<p>{fieldStatusDisplay.message}</p>
			</div>
		</SlideInOut>
	);
}
