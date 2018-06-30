import { Application } from '@pixi/app';
import { GameController, BulletController, ShipController } from 'shared/index';
import initPlayer, { PlayerKeyOptions } from './player';
import Element from './elements/base';
import ShipElement from './elements/ship';
import BulletElement from './elements/bullet';

export default class Game {
	private readonly __controller: GameController;
	private readonly __elements: Element<any, any>[] = [];

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this.__controller = GameController.createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);

		this.__controller.shipsForEach(shipController => {
			const ship = new ShipElement(shipController);
			app.stage.addChild(ship.display());
			this.__elements.push(ship);
		});

		playersKeys.forEach((playerKeys, i) => {
			initPlayer(i, playerKeys, this.__controller);
		});

		this.__controller.on(
			'bullet-added',
			(bulletController: BulletController) => {
				const bullet = new BulletElement(bulletController);
				app.stage.addChild(bullet.display());
				this.__elements.push(bullet);
			},
		);
	}

	tick(delta: number): void {
		this.__controller.tick(delta);
		for (let i = 0; i < this.__elements.length; i++) {
			this.__elements[i].flush();
		}
	}
}
