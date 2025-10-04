import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

export default function useUsernameEmailAvailability(field: 'username' | 'email', value: string, hasError: boolean = false) {
	const { apiClient } = useAuth();
	const [status, setStatus] = useState<AvailabilityStatus>('idle');

	const checkAvailability = useCallback(async () => {
		if (!value.trim() || hasError)
			return ;

		setStatus('checking');
		try {
			let isAvailable = false;

			if (field === 'username') {
				isAvailable = await apiClient?.isUsernameAvailable(value.trim());
			} else if (field === 'email') {
				isAvailable = await apiClient?.isEmailAvailable(value.trim());
			}
			setStatus(isAvailable ? 'available' : 'unavailable');
		} catch {
			setStatus('error');
		}
	}, [apiClient, field, value, hasError]);

	useEffect(() => {
		checkAvailability();
	}, [checkAvailability]);

	return status;
}
