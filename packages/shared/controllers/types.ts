import { BulletState } from './bullet';
import { GameState } from './game';
import { ShipState } from './ship';

export enum ControllerTypes {
	GAME,
	SHIP,
	BULLET,
}

export type ControllerState = GameState | ShipState | BulletState;
export type MovableState = ShipState | BulletState;
