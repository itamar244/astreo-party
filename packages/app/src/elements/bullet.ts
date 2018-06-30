import { Graphics } from '@pixi/graphics';
import BulletController from 'shared/bullet-controller';
import Element from './base';
import { YELLOW } from '../colors';

function createPoint(controller: BulletController) {
	const dot = new Graphics();

	dot.beginFill(YELLOW);
	dot.drawCircle(0, 0, controller.radius);

	dot.position.set(controller.x, controller.y);

	return dot;
}

export default class BulletElement extends Element<Graphics, BulletController> {
	constructor(controller: BulletController) {
		super(createPoint(controller), controller);
	}

	flush(): void {
		this._display.position.set(this._controller.x, this._controller.y);
	}
}
