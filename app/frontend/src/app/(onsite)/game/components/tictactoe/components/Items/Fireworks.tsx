import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { useXO } from '../../contexts/xoContext';

const Fireworks = () => {
	const { trigger } = useXO();

	useEffect(() => {
		if (!trigger) return;

		const duration = 2 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
		return () => {
			clearInterval(interval);
		};
	}, [trigger]);

	return null;
};

export default Fireworks;
