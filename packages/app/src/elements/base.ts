import { DisplayObject } from '@pixi/display';
import MoveableController from 'shared/movable-controller';

export default abstract class Element<
	Display extends DisplayObject,
	Controller extends MoveableController
> {
	protected readonly _display: Display;
	protected readonly _controller: Controller;

	constructor(controller: Controller) {
		this._controller = controller;
		this._display = this._init();
		this.flush();
	}

	protected abstract _init(): Display;

	display(): Display {
		return this._display;
	}

	flush(): void {
		this._display.position.set(this._controller.x, this._controller.y);
	}
}
