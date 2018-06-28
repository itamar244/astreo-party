import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import ShipController from './ship-controller';

export default class GameController extends EventEmitter implements Ticker {
	readonly shipsByName: { [key: number]: ShipController } = {};
	readonly bullets = new Set<BulletController>();
	public readonly ships = new Set<ShipController>();

	constructor(shipsOptions: Array<{ x: number; y: number }>) {
		super();
		for (let i = 0; i < shipsOptions.length; i++) {
			const ship = new ShipController(
				i,
				shipsOptions[i].x,
				shipsOptions[i].y,
			);
			this.shipsByName[ship.id] = ship;
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

	shoot(shipId: number) {
		const bullet = this.shipsByName[shipId].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this.bullets.add(bullet);
		}
	}
}
