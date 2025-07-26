function random(start: string) {
	const intValue = Math.floor(Math.random() * 1000) + 1;

	return start + intValue.toString();
}

export default random;
