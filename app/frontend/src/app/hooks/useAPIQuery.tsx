/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import useAPICall from './useAPICall';

export default function useAPIQuery(
	apiCall: () => Promise<any>,
	deps: React.DependencyList = []
) {
	const { isLoading, data, error, executeAPICall } = useAPICall();

	useEffect(() => {
		executeAPICall(apiCall);
	}, deps); // eslint-disable-line react-hooks/exhaustive-deps

	return { isLoading, data, error, executeAPICall };
}
