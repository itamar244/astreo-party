import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import ShipController, { ShipOptions } from './ship-controller';
import { randomNumber } from './utils';

export default class GameController extends EventEmitter implements Ticker {
	private readonly __shipsByID: { [key: number]: ShipController } = {};
	private readonly __bullets = new Set<BulletController>();
	private readonly __ships = new Set<ShipController>();

	static createRandomGame(
		ships: number,
		width: number,
		height: number,
	): GameController {
		const options: ShipOptions[] = [];
		for (let i = 0; i < ships; i++) {
			options.push({
				x: randomNumber(0, width),
				y: randomNumber(0, height),
				rotation: randomNumber(0, 1),
			});
		}
		return new GameController(options);
	}

	constructor(shipsOptions: ShipOptions[]) {
		super();
		for (let i = 0; i < shipsOptions.length; i++) {
			const ship = new ShipController(i, shipsOptions[i]);
			this.__shipsByID[ship.id] = ship;
			this.__ships.add(ship);
		}
	}

	tick(delta: number) {
		this.__ships.forEach(ship => {
			ship.tick(delta);
		});
		this.__bullets.forEach(bullet => {
			bullet.tick(delta);
		});
	}

	getShipById(shipID: number) {
		return this.__shipsByID[shipID] || null;
	}

	shipsForEach(func: (ShipController) => void) {
		this.__ships.forEach(func);
	}

	shoot(shipID: number) {
		const bullet = this.__shipsByID[shipID].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this.__bullets.add(bullet);
		}
	}
}
