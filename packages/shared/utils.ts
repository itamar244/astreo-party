export function randomNumber(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

/**
 * A .forEach() for iterators, with the option to break in the middle of the iteration.
 * for of() is being avoided in this project, therefore break inside .forEach()
 * is impossible. this function enables it.
 */
export function forEachWithBreak<T>(
	iterator: Iterator<T>,
	func: (value: T, breaker: () => void) => void,
) {
	const breaker = () => {
		toBreak = true;
	};
	let next = iterator.next();
	let toBreak = false;

	for (; !next.done && !toBreak; next = iterator.next()) {
		func(next.value, breaker);
	}
}
