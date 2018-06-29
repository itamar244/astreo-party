import { Application, Graphics } from 'pixi.js';
import {
	Ticker,
	GameController,
	BulletController,
	ShipController,
} from 'shared/index';
import initPlayer, { PlayerKeyOptions } from './player';
import ShipElement from './elements/ship';
import BulletElement from './elements/bullet';

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
			const bullet = new BulletElement(bulletController);
			app.stage.addChild(bullet);
			this.elements.push(bullet);
		});

		this.controller.shipsForEach(shipController => {
			const ship = new ShipElement(shipController);
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
