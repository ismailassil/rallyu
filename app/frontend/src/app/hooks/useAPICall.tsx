import { useState, useCallback } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { simulateBackendCall } from "../(api)/utils";
import axios from "axios";

function handleAPICallError(err: any) {
	console.group('handleError');
	console.log(err);
	console.groupEnd();
	if (axios.isAxiosError(err)) {
		if (err?.response) {
			// server responded with status other that 2xx
			if (err.response?.status >= 500) {
				if (err.response?.status === 503)
					return new Error('AUTH_SERVICE_UNAVAILABLE');
				return new Error('AUTH_GENERIC_ERR');
			}
			return new Error(err.response?.data?.error?.code || 'AUTH_GENERIC_ERR');
		} else if (err?.request) {
			// network issue
			return new Error('AUTH_NETWORK_ERR');
		} else {
			return new Error('AUTH_GENERIC_ERR');
		}
	} else {
		return new Error('AUTH_GENERIC_ERR');
	}
}

export default function useAPICall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);

	const executeAPICall = useCallback(async (apiCall: () => Promise<any>) => {
		setData(null);
		setError(null);
		setIsLoading(true);
		try {
			await simulateBackendCall(2000);
			const result = await apiCall();
			setData(result);
			return result;
		} catch (err: any) {
			const normalizedErr = handleAPICallError(err);
			setError(normalizedErr.message);
			throw normalizedErr;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, data, error, executeAPICall };
}
