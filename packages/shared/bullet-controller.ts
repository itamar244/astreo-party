import MovableController, { getProgress } from './movable-controller';
import PlayerController, { PLAYER_HEIGHT } from './player-controller';

export default class BulletController extends MovableController {
	readonly owner: PlayerController;

	constructor(owner: PlayerController) {
		const [x, y] = getProgress(owner.rotation, PLAYER_HEIGHT / 2);
		super(owner.x + x, owner.y + y, owner.rotation, 5);
		this.owner = owner;
	}
}
