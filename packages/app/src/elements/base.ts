import { DisplayObject } from '@pixi/display';
import { MovableState } from 'shared/controllers/movable';

export default abstract class Element<
	Display extends DisplayObject = DisplayObject,
	State extends MovableState = MovableState
> {
	protected readonly _display: Display;
	protected readonly _state: State;

	constructor(state: State) {
		this._state = state;
		this._display = this._init();
		this.flush();
	}

	display(): Display {
		return this._display;
	}

	flush(): void {
		this._display.position.set(this._state.x, this._state.y);
	}

	isElementOfState(state: MovableState): boolean {
		return this._state.id === state.id;
	}

	protected abstract _init(): Display;
}
