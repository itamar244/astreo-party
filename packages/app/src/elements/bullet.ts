import { Graphics } from '@pixi/graphics';
import { BulletState } from 'shared/controllers/bullet';
import { YELLOW } from '../colors';
import Element from './base';

export default class BulletElement extends Element<Graphics, BulletState> {
	_init(state: BulletState) {
		const circle = new Graphics();

		circle.beginFill(YELLOW);
		circle.drawCircle(0, 0, state.radius);

		return circle;
	}
}
