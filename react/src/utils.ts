export const formatNumber = (num: number): string => {
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
	if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
	return num.toString();
};

export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const secs = (seconds % 60).toString().padStart(2, "0");
	return `${mins}:${secs}`;
};

export const pickRandomItems = <T extends unknown>(
	arr: T[],
	n: number
): T[] => {
	if (n === 0) return [];

	const shuffled = arr.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
};
