import { Graphics } from '@pixi/graphics';
import BulletController from 'shared/bullet-controller';
import Element from './base';
import { YELLOW } from '../colors';

export default class BulletElement extends Element<Graphics, BulletController> {
	protected _init() {
		const circle = new Graphics();

		circle.beginFill(YELLOW);
		circle.drawCircle(0, 0, this._controller.radius);

		return circle;
	}
}
