type EventListener = (e: KeyboardEvent) => any;
interface Options {
	doublePressThreshhold?: number;
	onKeyDown?: EventListener;
	onDoubleKeyDown?: EventListener;
	onKeyUp?: EventListener;
}

export default function keyListener(
	key: string,
	_optionsOrOnKeyDown: Options | EventListener,
) {
	const options =
		typeof _optionsOrOnKeyDown === 'function'
			? { onKeyDown: _optionsOrOnKeyDown }
			: _optionsOrOnKeyDown;
	const {
		onKeyDown,
		doublePressThreshhold = 200,
		onDoubleKeyDown,
		onKeyUp,
	} = options;

	const listeners: Array<[string, EventListener]> = [];
	const addListener = (type: string, listener: EventListener) => {
		listeners.push([type, listener]);
		window.addEventListener(type, listener, { passive: true });
	};

	let pressed = false;
	let doublePressed = false;

	addListener('keydown', event => {
		if (!pressed && event.code === key) {
			pressed = true;
			onKeyDown(event);
		}
	});

	if (onDoubleKeyDown !== undefined) {
		let lastPressTime = 0;

		addListener('keydown', event => {
			const pressTime = Date.now();
			if (!doublePressed && event.code === key) {
				doublePressed = true;
				if (pressTime - lastPressTime <= doublePressThreshhold) {
					doublePressed = true;
					onDoubleKeyDown(event);
				}
			}
			lastPressTime = pressTime;
		});
	}

	// should always be called even if onKeyUp is undefined, for changing flags
	addListener('keyup', event => {
		if ((pressed || doublePressed) && event.code === key) {
			pressed = false;
			doublePressed = false;
			if (onKeyUp !== undefined) {
				onKeyUp(event);
			}
		}
	});

	return () => {
		for (const listener of listeners) {
			window.removeEventListener(listener[0], listener[1]);
		}
	};
}
