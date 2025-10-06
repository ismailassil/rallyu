import { useEffect, useState } from "react";
import { useAuth } from "../(onsite)/contexts/AuthContext";
import useAPICall from "./useAPICall";

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

export default function useAvailabilityCheck(
	fieldName: 'username' | 'email',
	currentValue: string,
	loggedInUserValue: string | null,
	debounced: boolean,
	error: string | undefined
) {

	const { apiClient } = useAuth();
	const { executeAPICall } = useAPICall();
	const [status, setStatus] = useState<AvailabilityStatus>('idle');

	useEffect(() => {
		const checkAvailability = async () => {
			if (currentValue === loggedInUserValue) {
				setStatus('idle');
				return ;
			}

			try {
				setStatus('checking');
				const isAvailable = await executeAPICall(() => fieldName === 'username' ? apiClient.isUsernameAvailable(currentValue) : apiClient.isEmailAvailable(currentValue));
				setStatus(isAvailable ? 'available' : 'unavailable');
			} catch {
				setStatus('error');
			}
		};

		if (debounced && !error)
			checkAvailability();
	}, [currentValue, debounced, error, loggedInUserValue, apiClient, executeAPICall, fieldName]);

	return status;
}
