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

export function objectEach<K extends string, V>(
	obj: Record<K, V>,
	func: (V, K) => void,
) {
	for (const key in obj) {
		func(obj[key], key);
	}
}

export function objectGuardedEach<K extends string, V>(
	obj: Record<K, V>,
	func: (V, K) => void,
) {
	for (const key in obj) {
		if (obj[key] != null) {
			func(obj[key], key);
		}
	}
}
