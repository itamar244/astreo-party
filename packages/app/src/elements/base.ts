import { DisplayObject } from '@pixi/display';
import { MovableState } from 'shared/controllers/movable';

export default abstract class Element<
	Display extends DisplayObject = DisplayObject,
	State extends MovableState = MovableState
> {
	protected readonly _display: Display;
	protected readonly _controller: State;

	constructor(controller: State) {
		this._controller = controller;
		this._display = this._init();
		this.flush();
	}

	display(): Display {
		return this._display;
	}

	flush(): void {
		this._display.position.set(this._controller.x, this._controller.y);
	}

	isElementOfState(controller: State): boolean {
		return this._controller === controller;
	}

	protected abstract _init(): Display;
}
