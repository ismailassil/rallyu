import { useState, useEffect } from "react";

interface UseResendCooldownOptions {
	initialCooldown?: number;
	maxResends?: number;
}

export default function useResendCooldown({ initialCooldown = 10, maxResends = 3 } : UseResendCooldownOptions = {}) {
	const [cooldown, setCooldown] = useState(0);
	const [resendCount, setResendCount] = useState(1);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (cooldown > 0) {
			interval = setInterval(() => {
				setCooldown((prev) => prev - 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [cooldown]);

	function startCooldown() {
		setCooldown(initialCooldown * resendCount);
		setResendCount(prev => prev + 1);
	}

	const isCooldownActive = cooldown > 0;
	const isMaxResendReached = resendCount - 1 >= maxResends;

	return {
		cooldown,
		isCooldownActive,
		startCooldown,
		resendCount: resendCount - 1,
		isMaxResendReached
	};
}
