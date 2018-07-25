// the top game
import { getBulletToShipCollision } from '../collision';
import { createScoreBoard, ScoreBoard, updateFromKill } from '../score-board';
import Ticker from '../ticker';
import { randomNumber, removeItemFromArray } from '../utils';
import { BulletState, bulletUpdators } from './bullet';
import { ControllerTypes, MovableState } from './types';
import { objectGuardedEach } from '../utils';
import {
	createShip,
	Direction,
	ShipOptions,
	ShipState,
	shipUpdators,
} from './ship';

export interface GameState {
	type: ControllerTypes.GAME;
	bullets: Record<string, BulletState>;
	// array containing IDs.
	livingShipsIDs: string[];
	scoreBoard: ScoreBoard;
	ships: Record<string, null | ShipState>;
}

export function createGame(shipsArr: ShipState[]): GameState {
	const ships = shipsArr.reduce((acc, cur) => {
		acc[cur.id] = cur;
		return acc;
	}, {});

	return {
		type: ControllerTypes.GAME,
		ships,
		bullets: {},
		livingShipsIDs: [],
		scoreBoard: createScoreBoard(6, ships),
	};
}

export function createRandomGame(
	shipsAmount: number,
	width: number,
	height: number,
): GameState {
	const ships: ShipState[] = [];
	for (let i = 0; i < shipsAmount; i++) {
		ships.push(
			createShip({
				rotation: randomNumber(0, 1),
				x: randomNumber(0, width),
				y: randomNumber(0, height),
			}),
		);
	}
	return createGame(ships);
}

export const gameUpdators = {
	initLivingShips(game: GameState) {
		game.livingShipsIDs = Object.values(game.ships).map(ship => ship.id);
	},

	tick(game: GameState, delta: number): string[] {
		const removedObjects = [];

		for (const id of game.livingShipsIDs) {
			shipUpdators.tick(game.ships[id], delta);
		}

		objectGuardedEach(game.bullets, bullet => {
			bulletUpdators.tick(bullet, delta);

			const hitShips = getBulletToShipCollision(bullet, game.ships);

			if (hitShips.length > 0) {
				removedObjects.push(bullet.id);
				game.bullets[bullet.id] = null;

				for (const ship of hitShips) {
					updateFromKill(game.scoreBoard, bullet, ship);
					removeItemFromArray(game.livingShipsIDs, ship.id);
				}
				removedObjects.push(...hitShips.map(ship => ship.id));
			}
		});

		return removedObjects;
	},

	updateTurnByID(game: GameState, id: string, dir: Direction) {
		const ship = game.ships[id];

		if (game.livingShipsIDs.includes(ship.id)) {
			shipUpdators.updateTurn(ship, dir);
		}
	},

	shoot(game: GameState, shipID: string) {
		const bullet = shipUpdators.shoot(game.ships[shipID]);
		if (bullet !== null) {
			game.bullets[bullet.id] = bullet;
			return bullet.id;
		}
		return null;
	},
};

export const gameAccessors = {
	elementsByID(game: GameState, id: string) {
		return game.ships[id] || game.bullets[id] || null;
	},
};
