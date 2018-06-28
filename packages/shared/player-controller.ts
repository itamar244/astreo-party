import MovableController from './movable-controller';
import BulletController from './bullet-controller';

export type TurnType = 0 | 1 | 2;

export const TURN_NONE = 0;
export const TURN_LEFT = 1;
export const TURN_RIGHT = 2;

export const PLAYER_HEIGHT = 45;
export const PLAYER_WIDTH = 30;

const MAX_AVAILABLE_BULLETS = 3;
const FRAMSE_UNTIL_RECHARGE = 60;

export default class PlayerController extends MovableController {
	turn: TurnType = TURN_NONE;
	private __availableBullets: number = MAX_AVAILABLE_BULLETS;
	private __sinceLastShot: number = 0;
	// private __rotationBeforeTurn: number = 0;
	// private __turnSince: number = 0;

	constructor(public readonly id: number, x: number, y: number) {
		super(x, y, 0, 2);
	}

	tick(delta: number) {
		// if (this.__turnSince > 0) {
		// 	this.__turnSince -= 1;
		// } else {
		// 	this.__move(this.rotation);
		// }
		super.tick(delta);

		if (this.__availableBullets < MAX_AVAILABLE_BULLETS) {
			this.__sinceLastShot += delta;
			if (this.__sinceLastShot > FRAMSE_UNTIL_RECHARGE) {
				this.__availableBullets += 1;
				this.__sinceLastShot = 0;
			}
		}

		if (this.turn !== TURN_NONE) {
			if (this.turn === TURN_LEFT) {
				this.rotation += 0.01;
				if (this.rotation >= 1) this.rotation -= 1;
			} else if (this.turn === TURN_RIGHT) {
				this.rotation -= 0.01;
				if (this.rotation <= 0) this.rotation += 1;
			}
		}
	}

	updateTurn(dir: TurnType) {
		// if (dir === TURN_NONE) {
		// 	this.__turnSince = 0;
		// } else {
		// 	this.__rotationBeforeTurn = this.rotation;
		// 	this.__turnSince = 10;
		// }
		this.turn = dir;
	}

	shoot() {
		if (this.__availableBullets > 0) {
			this.__availableBullets -= 1;
			return new BulletController(this);
		}
		return null;
	}
}
