import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function useAPIQuery(queryFn: () => Promise<any>) {
	const router = useRouter();
	const [data, setData] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
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
				const errorMessage = err?.message || "Something went wrong";
				setError(errorMessage);
				if (errorMessage.includes("not found")) router.replace("/404");
				// if (err && typeof err === 'object')
				// 	err.message = errorMessage;
				// throw err ?? new Error(errorMessage);
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
