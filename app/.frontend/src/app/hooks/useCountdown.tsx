import { useEffect, useState } from "react";

function useCountdown() {
	const [secondsLeft, setSecondsLeft] = useState(0);

	useEffect(() => {
		if (secondsLeft <= 0) return;

		const timeOut = setTimeout(() => {
			setSecondsLeft(secondsLeft - 1);
		}, 1000);

		return () => clearTimeout(timeOut);
	}, [secondsLeft]);

	function setStart(value: number) {
		setSecondsLeft(value);
	}

	return { secondsLeft, setStart };
}

export default useCountdown;
