import { DisplayObject } from '@pixi/display';
import { MovableState } from 'shared/controllers/movable';

export default abstract class Element<
	Display extends DisplayObject = DisplayObject,
	State extends MovableState = MovableState
> {
	protected readonly _display: Display;
	public readonly id: string;

	constructor(state: State) {
		this._display = this._init(state);
		this.id = state.id;
		this.flush(state);
	}

	display(): Display {
		return this._display;
	}

	flush(state: State): void {
		this._display.position.set(state.x, state.y);
	}

	isElementOfState(state: MovableState): boolean {
		return this.id === state.id;
	}

	protected abstract _init(state: State): Display;
}
