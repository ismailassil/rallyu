import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";

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

export default function useAPIQuery(queryFn: () => Promise<any>) {
	const router = useRouter();

	const tautherr = useTranslations('auth');

	const [data, setData] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const executeAPICall = useCallback(
		async (isManualRefetch = false) => {
			if (!isManualRefetch) {
				setIsLoading(true);
			} else {
				setIsRefetching(true);
			}
			setError(null);
			try {
				const result = await queryFn();
				setData(result);
				return result;
			} catch (err: any) {
				const normalizedErr = handleAPICallError(err);
				setError(tautherr('errorCodes', { code: normalizedErr.message }));
				if (normalizedErr.message.includes('NOT_FOUND')) router.replace('/404');
			} finally {
				setIsLoading(false);
				setIsRefetching(false);
			}
		},
		[queryFn]
	);

	useEffect(() => {
		executeAPICall(false);
	}, []);

	const refetch = useCallback(() => executeAPICall(true), [executeAPICall]);

	return { isLoading, isRefetching, data, error, refetch };
}
