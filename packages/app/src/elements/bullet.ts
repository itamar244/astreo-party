import { Graphics } from '@pixi/graphics';
import { BulletState } from 'shared/controllers/bullet';
import { YELLOW } from '../colors';
import Element from './base';

export default class BulletElement extends Element<Graphics, BulletState> {
	_init() {
		const circle = new Graphics();

		circle.beginFill(YELLOW);
		circle.drawCircle(0, 0, this._state.radius);

		return circle;
	}
}
