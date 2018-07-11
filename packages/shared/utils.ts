export function randomNumber(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

export function removeItemFromArray<T>(array: T[], item: T) {
	array.splice(array.indexOf(item), 1);
}

let id = 0;

export function generateID(): string {
	const cur = id++;
	return cur.toString(10);
}
