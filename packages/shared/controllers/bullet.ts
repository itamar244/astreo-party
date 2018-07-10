import { getProgress, MovableState, move, tick } from './movable';
import { SHIP_HEIGHT, ShipState } from './ship';

export const BULLET_RADIUS = 5;

export interface BulletState extends MovableState {
	owner: number;
	radius: number;
}

export function createBulletFromShip(owner: ShipState) {
	const [x, y] = getProgress(owner.rotation, SHIP_HEIGHT / 2);

	return {
		owner: owner.id,
		x: owner.x + x,
		y: owner.y + y,
		rotation: owner.rotation,
		radius: BULLET_RADIUS,
		speed: 5,
	};
}

export const bulletUpdators = {
	tick,
	move,
};
