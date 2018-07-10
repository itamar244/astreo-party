// the top game
import { getBulletToShipCollision } from '../collision';
import { createScoreBoard, ScoreBoard, updateFromKill } from '../score-board';
import Ticker from '../ticker';
import { randomNumber, removeItemFromArray } from '../utils';
import { BulletController, bulletUpdators } from './bullet';
import {
	createShip,
	Direction,
	ShipController,
	ShipOptions,
	shipUpdators,
} from './ship';

export interface GameController {
	bullets: BulletController[];
	livingShips: ShipController[];
	scoreBoard: ScoreBoard;
	shipsByID: { [key: number]: ShipController };
	ships: ShipController[];
}

export function createGameController(options: ShipOptions[]): GameController {
	const shipsByID = {};
	const ships: ShipController[] = [];
	for (let i = 0; i < options.length; i++) {
		const ship = createShip(i, options[i]);
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
): GameController {
	const options: ShipOptions[] = [];
	for (let i = 0; i < ships; i++) {
		options.push({
			rotation: randomNumber(0, 1),
			x: randomNumber(0, width),
			y: randomNumber(0, height),
		});
	}
	return createGameController(options);
}

export const gameUpdators = {
	initLivingShips(game: GameController) {
		game.livingShips = game.ships.slice();
	},

	tick(game: GameController, delta: number): ShipController[] {
		const killedShips = [];
		for (const ship of game.livingShips) {
			shipUpdators.tick(ship, delta);
		}

		for (const bullet of game.bullets) {
			bulletUpdators.tick(bullet, delta);
			const hitShips = getBulletToShipCollision(bullet, game.ships);
			for (const ship of hitShips) {
				updateFromKill(game.scoreBoard, bullet, ship);
				removeItemFromArray(game.livingShips, ship);
			}
			killedShips.push(...hitShips);
		}
		return killedShips;
	},

	updateTurnByID(game: GameController, id: number, dir: Direction) {
		shipUpdators.updateTurn(game.shipsByID[id], dir);
	},

	shoot(game: GameController, shipID: number) {
		const bullet = shipUpdators.shoot(game.shipsByID[shipID]);
		if (bullet !== null) {
			game.bullets.push(bullet);
		}
		return bullet;
	},

};
