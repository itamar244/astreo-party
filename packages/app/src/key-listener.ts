type EventListener = (e: KeyboardEvent) => any;
type Options = {
	doublePressThreshhold?: number;
	onKeyDown?: EventListener;
	onDoubleKeyDown?: EventListener;
	onKeyUp?: EventListener;
};

export default function keyListener(key: string, onKeyDown: EventListener);
export default function keyListener(key: string, options: Options);
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
		onDoubleKeyDown = undefined,
		onKeyUp = undefined,
	} = options;

	const listeners: [string, EventListener][] = [];
	const addListener = (type: string, listener: EventListener) => {
		listeners.push([type, listener]);
		window.addEventListener(type, listener, { passive: true });
	};

	let pressed = false;
	let doublePressed = false;
	let keydown;

	addListener('keydown', event => {
		if (!pressed && event.code === key) {
			pressed = true;
			onKeyDown(event);
		}
	});

	if (onDoubleKeyDown !== undefined) {
		let lastPressTime = 0;

		addListener('keydown', event => {
			let pressTime = Date.now();
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
		for (let i = 0; i < listeners.length; i++) {
			window.removeEventListener(listeners[i][0], listeners[i][1]);
		}
	};
}
