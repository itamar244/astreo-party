import { DisplayObject } from '@pixi/display';
import MoveableController from 'shared/controllers/movable';

export default abstract class Element<
	Display extends DisplayObject = DisplayObject,
	Controller extends MoveableController = MoveableController
> {
	protected readonly _display: Display;
	protected readonly _controller: Controller;

	constructor(controller: Controller) {
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

	isElementOfController(controller: Controller): boolean {
		return this._controller === controller;
	}

	protected abstract _init(): Display;
}
