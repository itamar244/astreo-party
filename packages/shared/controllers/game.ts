// the top game
import { getBulletToShipCollision } from '../collision';
import { createScoreBoard, ScoreBoard, updateFromKill } from '../score-board';
import Ticker from '../ticker';
import { randomNumber, removeItemFromArray } from '../utils';
import { BulletState, bulletUpdators } from './bullet';
import { ControllerTypes } from './types';
import {
	createShip,
	Direction,
	ShipOptions,
	ShipState,
	shipUpdators,
} from './ship';

export interface GameState {
	type: ControllerTypes.GAME;
	bullets: BulletState[];
	livingShips: ShipState[];
	scoreBoard: ScoreBoard;
	shipsByID: Record<string, ShipState>;
	ships: ShipState[];
}

export function createGame(ships: ShipState[]): GameState {
	return {
		ships,
		shipsByID: ships.reduce((acc, cur) => {
			acc[cur.id] = cur;
			return acc;
		}, {}),
		type: ControllerTypes.GAME,
		bullets: [],
		livingShips: [],
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
		game.livingShips = game.ships.slice();
	},

	tick(game: GameState, delta: number): ShipState[] {
		const removedObjects = [];

		for (const ship of game.livingShips) {
			shipUpdators.tick(ship, delta);
		}

		for (const bullet of game.bullets) {
			bulletUpdators.tick(bullet, delta);

			const hitShips = getBulletToShipCollision(bullet, game.ships);

			if (hitShips.length > 0) {
				removedObjects.push(bullet);
				removeItemFromArray(game.bullets, bullet);

				for (const ship of hitShips) {
					updateFromKill(game.scoreBoard, bullet, ship);
					removeItemFromArray(game.livingShips, ship);
				}
				removedObjects.push(...hitShips);
			}
		}

		return removedObjects;
	},

	updateTurnByID(game: GameState, id: string, dir: Direction) {
		shipUpdators.updateTurn(game.shipsByID[id], dir);
	},

	shoot(game: GameState, shipID: string) {
		const bullet = shipUpdators.shoot(game.shipsByID[shipID]);
		if (bullet !== null) {
			game.bullets.push(bullet);
		}
		return bullet;
	},
};
