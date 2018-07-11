// the top game
import { getBulletToShipCollision } from '../collision';
import { createScoreBoard, ScoreBoard, updateFromKill } from '../score-board';
import Ticker from '../ticker';
import { randomNumber, removeItemFromArray } from '../utils';
import { BulletState, bulletUpdators } from './bullet';
import {
	createShip,
	Direction,
	ShipState,
	ShipOptions,
	shipUpdators,
} from './ship';

export interface GameState {
	bullets: BulletState[];
	livingShips: ShipState[];
	scoreBoard: ScoreBoard;
	shipsByID: Record<string, ShipState>;
	ships: ShipState[];
}

export function createGameState(options: ShipOptions[]): GameState {
	const shipsByID = {};
	const ships: ShipState[] = [];
	for (let i = 0; i < options.length; i++) {
		const ship = createShip(options[i]);
		shipsByID[ship.id] = ship;
		ships.push(ship);
	}

	return {
		ships,
		shipsByID,
		bullets: [],
		livingShips: ships.slice(),
		scoreBoard: createScoreBoard(6, ships),
	};
}

export function createRandomGame(
	ships: number,
	width: number,
	height: number,
): GameState {
	const options: ShipOptions[] = [];
	for (let i = 0; i < ships; i++) {
		options.push({
			rotation: randomNumber(0, 1),
			x: randomNumber(0, width),
			y: randomNumber(0, height),
		});
	}
	return createGameState(options);
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
