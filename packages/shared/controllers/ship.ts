import { PI_2 } from '@pixi/math';
import Point from '../point';
import { generateID } from '../utils';
import { BulletState, createBulletFromShip } from './bullet';
import { MovableState, movableUpdators } from './movable';
import { ControllerTypes } from './types';

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

export interface ShipState extends MovableState {
	type: ControllerTypes.SHIP;
	// _rotationBeforeTurn: number;
	// _turnSince: number;
	turn: Direction;
	availableBullets: number;
	sinceLastShot: number;
}

export function createShip(options: ShipOptions): ShipState {
	return {
		...options,
		type: ControllerTypes.SHIP,
		id: generateID(),
		availableBullets: MAX_AVAILABLE_BULLETS,
		turn: Direction.STRAIGHT,
		sinceLastShot: 0,
		speed: 2,
	};
}

export function shipToPolygon(ship: ShipState): Point[] {
	const angle = ship.rotation * PI_2;
	const center = new Point(ship.x, ship.y);

	return SHIP_POLYGON.map(point => point.rotate(angle).add(center));
}

export const shipUpdators = {
	tick(ship: ShipState, delta: number) {
		// if (ship.turnSince > 0) {
		// 	ship.turnSince -= 1;
		// } else {
		// 	ship.move(ship.rotation);
		// }
		movableUpdators.tick(ship, delta);

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

	updateTurn(ship: ShipState, dir: Direction) {
		// if (dir === Direction.STRAIGHT) {
		// 	ship.turnSince = 0;
		// } else {
		// 	ship.rotationBeforeTurn = ship.rotation;
		// 	ship.turnSince = 10;
		// }
		ship.turn = dir;
	},

	// should be used internaly
	shoot(ship: ShipState) {
		if (ship.availableBullets > 0) {
			ship.availableBullets -= 1;
			return createBulletFromShip(ship);
		}
		return null;
	},
};
