import type { Event } from "socket.io";
import UserIdTokenBucket from "./TokenBucket.js";
import { app } from "@/app.js";

interface Config {
	// Bucket Size
	maxBurst: number;

	// How many tokens will be added to bucket per second
	perSecond: number;
}

const socketRateLimiter = (config: Config) => {
	const { maxBurst, perSecond } = config;

	const bucket = new UserIdTokenBucket({
		maxBurst,
		perSecond,
	});

	return (_: Event, next: (err?: Error) => void) => {
		const hasToken = bucket.take();

		if (hasToken) {
			next();
		} else {
			app.log.error("[SOCKETIO] TOO MANY REQUESTS, SLOW DOWN")
			next(new Error("Too many requests, slow down."));
		}
	};
};

export default socketRateLimiter;
