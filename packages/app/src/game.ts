import { Container, Graphics } from 'pixi.js';
import {
	Ticker,
	GameController,
	BulletController,
	ShipController,
} from 'shared';
import Ship, { ShipKeyOptions } from './ship';
import Bullet from './bullet';

export default class Game {
	private readonly controller: GameController;
	private readonly stage: Container;
	private readonly elements: Ticker[] = [];

	constructor(stage: Container, shipsKeys: ShipKeyOptions[]) {
		this.stage = stage;
		// TODO: make cleaner once there is a new design in mind
		this.controller = new GameController([{ x: 100, y: 100 }]);

		this.controller.on('bullet-added', (bullet: BulletController) => {
			const element = new Bullet(bullet);
			this.elements.push(element);
			this.stage.addChild(element);
		});

		this.controller.ships.forEach(shipController => {
			const ship = new Ship(
				shipsKeys[shipController.id],
				shipController,
				() => {
					this.controller.shoot(shipController.id);
				},
			);
			this.stage.addChild(ship);
			this.elements.push(ship);
		})
	}

	tick(delta: number): void {
		this.controller.tick(delta);
		for (let i = 0; i < this.elements.length; i++) {
			this.elements[i].tick(delta);
		}
	}
}
