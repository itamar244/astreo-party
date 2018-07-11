import { generateID } from '../utils';
import { getProgress, MovableState, move, tick } from './movable';
import { SHIP_HEIGHT, ShipState } from './ship';

export const BULLET_RADIUS = 5;

export interface BulletState extends MovableState {
	owner: string;
	radius: number;
}

export function createBulletFromShip(owner: ShipState): BulletState {
	const [x, y] = getProgress(owner.rotation, SHIP_HEIGHT / 2);

	return {
		id: generateID(),
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
