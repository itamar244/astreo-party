import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import ShipController from './ship-controller';

export default class GameController extends EventEmitter implements Ticker {
	private readonly shipsByID: { [key: number]: ShipController } = {};
	private readonly bullets = new Set<BulletController>();
	public readonly ships = new Set<ShipController>();

	constructor(shipsOptions: Array<{ x: number; y: number }>) {
		super();
		for (let i = 0; i < shipsOptions.length; i++) {
			const ship = new ShipController(i, shipsOptions[i].x, shipsOptions[i].y);
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
