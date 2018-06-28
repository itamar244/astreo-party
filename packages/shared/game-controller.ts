import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import ShipController, { ShipOptions } from './ship-controller';
import { randomNumber } from './utils';

export default class GameController extends EventEmitter implements Ticker {
	private readonly shipsByID: { [key: number]: ShipController } = {};
	private readonly bullets = new Set<BulletController>();
	public readonly ships = new Set<ShipController>();

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
			this.shipsByID[ship.id] = ship;
			this.ships.add(ship);
		}
	}

	tick(delta: number) {
		this.ships.forEach(ship => {
			ship.tick(delta);
		});
		this.bullets.forEach(bullet => {
			bullet.tick(delta);
		});
	}

	getShipById(shipID: number) {
		return this.shipsByID[shipID] || null;
	}

	shoot(shipID: number) {
		const bullet = this.shipsByID[shipID].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this.bullets.add(bullet);
		}
	}
}
