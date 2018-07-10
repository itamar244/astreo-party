export function randomNumber(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export function removeItemFromArray<T>(array: T[], item: T) {
	array.splice(array.indexOf(item), 1);
}
