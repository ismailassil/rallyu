
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

export function relativeTimeAgoFromNow(epochInSeconds: number) {
	const now = Math.floor(Date.now() / 1000);
	const diff = now - epochInSeconds;

	const oneHour = 3600;
	const oneDay = 86400;
	const oneMonth = 2592000; // 30 days
	const oneYear = 31536000;

	if (diff < 10)
		return "just now";
	if (diff < 60)
		return `${diff} seconds ago`;
	if (diff < oneHour) { // less that 1 hour
		const minutesDiff = Math.floor(diff / 60);
		return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} ago`;
	}
	if (diff < oneDay) { // less than 24 hours
		const hoursDiff = Math.floor(diff / oneHour);
		return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
	}
	if (diff < oneMonth) { // less than 30 days
		const daysDiff = Math.floor(diff / oneDay);
		return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
	}
	if (diff < oneYear) { // less than 365 days
		const monthsDiff = Math.floor(diff / oneMonth);
		return `${monthsDiff} month${monthsDiff !== 1 ? 's' : ''} ago`;
	}
	else { // more than 365 days
		const yearsDiff = Math.floor(diff / oneYear);
		return `${yearsDiff} year${yearsDiff !== 1 ? 's' : ''} ago`;
	}
}

export function simulateBackendCall(ms: number, factor: number = 0) {
	const shouldFail = Math.random() < factor;
	
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldFail)
				reject(new Error('Simulated backend error'));
			else
				resolve({ message: 'Simulated backend sucess' });
		}, ms);
	});
}

