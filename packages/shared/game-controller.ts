import { EventEmitter } from 'events';
import BulletController from './bullet-controller';
import ShipController, { ShipOptions } from './ship-controller';
import Ticker from './ticker';
import { randomNumber } from './utils';

export default class GameController extends EventEmitter implements Ticker {
	static createRandomGame(
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
		return new GameController(options);
	}

	private readonly _shipsByID: { [key: number]: ShipController } = {};
	private readonly _bullets = new Set<BulletController>();
	private readonly _ships = new Set<ShipController>();

	constructor(shipsOptions: ShipOptions[]) {
		super();
		for (let i = 0; i < shipsOptions.length; i++) {
			const ship = new ShipController(i, shipsOptions[i]);
			this._shipsByID[ship.id] = ship;
			this._ships.add(ship);
		}
	}

	tick(delta: number) {
		this._ships.forEach(ship => {
			ship.tick(delta);
		});
		this._bullets.forEach(bullet => {
			bullet.tick(delta);
		});
	}

	getShipById(shipID: number) {
		return this._shipsByID[shipID] || null;
	}

	shipsForEach(func: (controller: ShipController) => void) {
		this._ships.forEach(func);
	}

	shoot(shipID: number) {
		const bullet = this._shipsByID[shipID].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this._bullets.add(bullet);
		}
	}
}
