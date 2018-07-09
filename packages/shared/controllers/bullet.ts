import MovableController, { getProgress } from './movable';
import ShipController, { SHIP_HEIGHT } from './ship';

export const BULLET_RADIUS = 5;

export default class BulletController extends MovableController {
	public readonly owner: ShipController;

	constructor(owner: ShipController) {
		const [x, y] = getProgress(owner.rotation, SHIP_HEIGHT / 2);
		super(owner.x + x, owner.y + y, owner.rotation, 5);
		this.owner = owner;
	}

	get radius() {
		return BULLET_RADIUS;
	}
}
