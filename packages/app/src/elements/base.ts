import { DisplayObject } from 'pixi.js';
import MoveableController from 'shared/movable-controller';

export default abstract class Element<
	Display extends DisplayObject,
	Controller extends MoveableController
> {
	constructor(
		protected readonly _display: Display,
		protected readonly _controller: Controller,
	) {}

	display(): Display {
		return this._display;
	}

	abstract flush(): void;
}
