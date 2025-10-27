interface TokenBucketContructor {
	maxBurst: number;
	perSecond: number;
}

export default class UserIdTokenBucket {
	private readonly capacity: number;
	private readonly perSecond: number;

	private lastFilled: number;
	private tokens: number;

	constructor({ maxBurst, perSecond }: TokenBucketContructor) {
		this.capacity = maxBurst || 10;
		this.perSecond = perSecond;

		this.lastFilled = Date.now();
		this.tokens = this.capacity;
	}

	take() {
		this.#refill();

		if (this.tokens > 0) {
			this.tokens -= 1;
			return true;
		}

		return false;
	}

	#refill() {
		const now = Date.now();
		const elapsedTime = (now - this.lastFilled) / 1_000;
		const refill = elapsedTime * this.perSecond;

		this.tokens = Math.min(this.capacity, this.tokens + refill);
		this.lastFilled = now;
	}
}
