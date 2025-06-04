import { Post } from "./types";

export function formatNumber(num: number): string {
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
	if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
	return num.toString();
}

export const rotatePosts = (posts: Post[], n: number): Post[] => {
	const len = posts.length;
	const rotation = ((n % len) + len) % len; // Handle negative and large n
	return [...posts.slice(rotation), ...posts.slice(0, rotation)];
};

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60)
		.toString()
		.padStart(2, "0");
	const secs = (seconds % 60).toString().padStart(2, "0");
	return `${mins}:${secs}`;
}
