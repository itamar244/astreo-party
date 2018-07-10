import { PI_2 } from '@pixi/math';
import Point from '../point';
import { BulletController, createBulletFromShip } from './bullet';
import { MovableController, tick as movableTick } from './movable';

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
export const SHIP_WIDTH = 35;
export const SHIP_POLYGON = [
	new Point(0, +SHIP_HEIGHT / 2),
	new Point(-SHIP_WIDTH / 2, -SHIP_HEIGHT / 2),
	new Point(+SHIP_WIDTH / 2, -SHIP_HEIGHT / 2),
];
const MAX_AVAILABLE_BULLETS = 3;
const FRAMES_UNTIL_RECHARGE = 60;

export interface ShipController extends MovableController {
	// _rotationBeforeTurn: number;
	// _turnSince: number;
	id: number;
	turn: Direction;
	availableBullets: number;
	sinceLastShot: number;
}

export function createShip(id: number, options: ShipOptions) {
	return {
		...options,
		id,
		availableBullets: MAX_AVAILABLE_BULLETS,
		turn: Direction.STRAIGHT,
		sinceLastShot: 0,
		speed: 2,
	};
}

export function shipToPolygon(ship: ShipController): Point[] {
	const angle = ship.rotation * PI_2;
	const center = new Point(ship.x, ship.y);

	return SHIP_POLYGON.map(point => point.rotate(angle).add(center));
}

export const shipUpdators = {
	tick(ship: ShipController, delta: number) {
		// if (ship.turnSince > 0) {
		// 	ship.turnSince -= 1;
		// } else {
		// 	ship.move(ship.rotation);
		// }
		movableTick(ship, delta);

		if (ship.availableBullets < MAX_AVAILABLE_BULLETS) {
			ship.sinceLastShot += delta;
			if (ship.sinceLastShot > FRAMES_UNTIL_RECHARGE) {
				ship.availableBullets += 1;
				ship.sinceLastShot = 0;
			}
		}

		if (ship.turn !== Direction.STRAIGHT) {
			if (ship.turn === Direction.LEFT) {
				ship.rotation += 0.01;
				if (ship.rotation >= 1) {
					ship.rotation -= 1;
				}
			} else if (ship.turn === Direction.RIGHT) {
				ship.rotation -= 0.01;
				if (ship.rotation <= 0) {
					ship.rotation += 1;
				}
			}
		}
	},

	updateTurn(ship: ShipController, dir: Direction) {
		// if (dir === Direction.STRAIGHT) {
		// 	ship.turnSince = 0;
		// } else {
		// 	ship.rotationBeforeTurn = ship.rotation;
		// 	ship.turnSince = 10;
		// }
		ship.turn = dir;
	},

	// should be used internaly
	shoot(ship: ShipController) {
		if (ship.availableBullets > 0) {
			ship.availableBullets -= 1;
			return createBulletFromShip(ship);
		}
		return null;
	},
};
