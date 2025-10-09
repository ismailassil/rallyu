/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { simulateBackendCall } from "../(api)/utils";

export default function useAPICall() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);

	const executeAPICall = useCallback(async (apiCall: () => Promise<any>) => {
		setData(null);
		setError(null);
		setIsLoading(true);
		try {
			// await simulateBackendCall(2000);
			const result = await apiCall();
			setData(result);
			return result;
		} catch (err: any) {
			const errorMessage = err?.message || 'Something went wrong';
			setError(errorMessage);
			err.message = errorMessage;
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { isLoading, data, error, executeAPICall };
}
