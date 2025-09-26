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

export function simulateBackendCall(ms: number) {
	const shouldFail = Math.random() < 0.5; 
	
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldFail)
				reject(new Error('Simulated backend error'));
			else
				resolve({ message: 'Simulated backend sucess' });
		}, ms);
	});
}