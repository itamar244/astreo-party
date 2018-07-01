import { Application } from '@pixi/app';
import { GameController, BulletController, ShipController } from 'shared/index';
import initPlayer, { PlayerKeyOptions } from './player';
import Element from './elements/base';
import ShipElement from './elements/ship';
import BulletElement from './elements/bullet';

export default class Game {
	private readonly _controller: GameController;
	private readonly _elements: Element<any, any>[] = [];

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this._controller = GameController.createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);

		this._controller.shipsForEach(shipController => {
			const ship = new ShipElement(shipController);
			app.stage.addChild(ship.display());
			this._elements.push(ship);
		});

		playersKeys.forEach((playerKeys, i) => {
			initPlayer(i, playerKeys, this._controller);
		});

		this._controller.on(
			'bullet-added',
			(bulletController: BulletController) => {
				const bullet = new BulletElement(bulletController);
				app.stage.addChild(bullet.display());
				this._elements.push(bullet);
			},
		);
	}

	tick(delta: number): void {
		this._controller.tick(delta);
		for (let i = 0; i < this._elements.length; i++) {
			this._elements[i].flush();
		}
	}
}
