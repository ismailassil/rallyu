export function getBearerToken(authorizationHeader: string | undefined | null) {
	if (!authorizationHeader)
		return null;

	const bearerToken = authorizationHeader.startsWith('Bearer')
		? authorizationHeader.slice(7)
		: authorizationHeader;

	return bearerToken;
}
