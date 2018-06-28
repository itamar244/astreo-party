import { Application, Graphics } from 'pixi.js';
import {
	Ticker,
	GameController,
	BulletController,
	ShipController,
} from 'shared';
import initPlayer, { PlayerKeyOptions } from './player';
import Ship from './ship';
import Bullet from './bullet';

export default class Game {
	private readonly controller: GameController;
	private readonly elements: Ticker[] = [];

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this.controller = GameController.createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);

		this.controller.on('bullet-added', (bulletController: BulletController) => {
			const bullet = new Bullet(bulletController);
			app.stage.addChild(bullet);
			this.elements.push(bullet);
		});

		this.controller.ships.forEach(shipController => {
			const ship = new Ship(shipController);
			app.stage.addChild(ship);
			this.elements.push(ship);
		});

		playersKeys.forEach((playerKeys, i) => {
			initPlayer(i, playerKeys, this.controller);
		});
	}

	tick(delta: number): void {
		this.controller.tick(delta);
		for (let i = 0; i < this.elements.length; i++) {
			this.elements[i].tick(delta);
		}
	}
}
