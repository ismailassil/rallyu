export const API_GATEWAY_BASE_URL = 'http://localhost:4025/api';


// normalizes '/avatars/xyz' to 'https://ms-auth/avatars/something.png'
export function normalizeAvatarUrl(avatarURL: string) {
	try {
		// if its already a valid absolute URL => return it
		new URL(avatarURL);
		return avatarURL;
	} catch {
		// not a valid URL => relative
		return `${API_GATEWAY_BASE_URL}${avatarURL}`;
	}
}

export function secondsToHMS(seconds: number) {
	seconds = Number(seconds);
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);

	const parts = [];
	if (h > 0) parts.push(h + "h");
	if (m > 0) parts.push(m + "m");
	if (s > 0 || parts.length === 0) parts.push(s + "s"); // include 0s if nothing else

	return parts.join(" ");
}

export function secondsToMinutes(seconds: number) {
	return Math.floor(seconds / 60);
}
