import MovableController, { getProgress } from './movable-controller';
import ShipController, { SHIP_HEIGHT } from './ship-controller';

export default class BulletController extends MovableController {
	readonly owner: ShipController;

	constructor(owner: ShipController) {
		const [x, y] = getProgress(owner.rotation, SHIP_HEIGHT / 2);
		super(owner.x + x, owner.y + y, owner.rotation, 5);
		this.owner = owner;
	}
}
