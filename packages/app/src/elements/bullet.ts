import { Graphics } from '@pixi/graphics';
import BulletController from 'shared/bullet-controller';
import { YELLOW } from '../colors';
import Element from './base';

export default class BulletElement extends Element<Graphics, BulletController> {
	_init() {
		const circle = new Graphics();

		circle.beginFill(YELLOW);
		circle.drawCircle(0, 0, this._controller.radius);

		return circle;
	}
}
