export default function keyListener(
	key: string,
	onKeyDown: (e: KeyboardEvent) => any,
	onKeyUp: (e: KeyboardEvent) => any,
) {
	let pressed = false;
	const keydown = (event: KeyboardEvent) => {
		if (!pressed && event.code === key) {
			pressed = true;
			onKeyDown(event);
		}
	};

	const keyup = (event: KeyboardEvent) => {
		if (pressed && event.code === key) {
			pressed = false;
			onKeyUp(event);
		}
	};

	window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);

	return () => {
		window.removeEventListener('keydown', keydown);
		window.removeEventListener('keyup', keyup);
	};
}
