import { PI_2 } from '@pixi/math';
import BulletController from './bullet-controller';
import MovableController from './movable-controller';
import Point from './point';

export interface ShipOptions {
	x: number;
	y: number;
	rotation: number;
}

export enum Direction {
	STRAIGHT,
	LEFT,
	RIGHT,
}

export const SHIP_HEIGHT = 45;
export const SHIP_WIDTH = 30;
const MAX_AVAILABLE_BULLETS = 3;
const FRAMES_UNTIL_RECHARGE = 60;

export default class ShipController extends MovableController {
	public turn: Direction = Direction.STRAIGHT;
	private _availableBullets: number = MAX_AVAILABLE_BULLETS;
	private _sinceLastShot: number = 0;
	// private _rotationBeforeTurn: number = 0;
	// private _turnSince: number = 0;

	constructor(public readonly id: number, options: ShipOptions) {
		super(options.x, options.y, options.rotation, 2);
	}

	tick(delta: number) {
		// if (this._turnSince > 0) {
		// 	this._turnSince -= 1;
		// } else {
		// 	this._move(this.rotation);
		// }
		super.tick(delta);

		if (this._availableBullets < MAX_AVAILABLE_BULLETS) {
			this._sinceLastShot += delta;
			if (this._sinceLastShot > FRAMES_UNTIL_RECHARGE) {
				this._availableBullets += 1;
				this._sinceLastShot = 0;
			}
		}

		if (this.turn !== Direction.STRAIGHT) {
			if (this.turn === Direction.LEFT) {
				this.rotation += 0.01;
				if (this.rotation >= 1) {
					this.rotation -= 1;
				}
			} else if (this.turn === Direction.RIGHT) {
				this.rotation -= 0.01;
				if (this.rotation <= 0) {
					this.rotation += 1;
				}
			}
		}
	}

	updateTurn(dir: Direction) {
		// if (dir === Direction.STRAIGHT) {
		// 	this._turnSince = 0;
		// } else {
		// 	this._rotationBeforeTurn = this.rotation;
		// 	this._turnSince = 10;
		// }
		this.turn = dir;
	}

	// should be used internaly
	shoot() {
		if (this._availableBullets > 0) {
			this._availableBullets -= 1;
			return new BulletController(this);
		}
		return null;
	}

	toPolygon(): Point[] {
		const angle = this.rotation * PI_2;

		return [
			new Point(this.x, this.y + SHIP_HEIGHT / 2).rotate(angle, this),
			new Point(this.x - SHIP_WIDTH / 2, this.y - SHIP_HEIGHT / 2).rotate(
				angle,
				this,
			),
			new Point(this.x + SHIP_WIDTH / 2, this.y - SHIP_HEIGHT / 2).rotate(
				angle,
				this,
			),
		];
	}
}
