import { generateID } from '../utils';
import { getProgress, MovableState, movableUpdators } from './movable';
import { SHIP_HEIGHT, ShipState } from './ship';

export const BULLET_RADIUS = 5;

export interface BulletState extends MovableState {
	owner: string;
	radius: number;
}

export function createBulletFromShip(owner: ShipState): BulletState {
	const { x, y } = getProgress(owner.rotation, SHIP_HEIGHT / 2);

	return {
		id: generateID(),
		x: owner.x + x,
		y: owner.y + y,
		owner: owner.id,
		radius: BULLET_RADIUS,
		rotation: owner.rotation,
		speed: 5,
	};
}

export const bulletUpdators = movableUpdators;
