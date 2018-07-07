import { Application } from '@pixi/app';
import { Container } from '@pixi/core';
import { BulletController, GameController, ShipController } from 'shared/index';
import { forEachWithBreak } from 'shared/utils';
import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import initPlayer, { PlayerKeyOptions } from './player';

export default class Game {
	private readonly _controller: GameController;
	private readonly _elements = new Set<Element>();

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this._controller = GameController.createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);
		this._controller.initLivingShips();

		this._controller.shipsForEach(shipController => {
			const ship = new ShipElement(shipController);
			app.stage.addChild(ship.display());
			this._elements.add(ship);
		});

		playersKeys.forEach((playerKeys, i) => {
			initPlayer(i, playerKeys, this._controller);
		});
	}

	initControllerListeners(stage: Container): void {
		this._controller.on(
			'bullet-added',
			(bulletController: BulletController) => {
				const bullet = new BulletElement(bulletController);
				stage.addChild(bullet.display());
				this._elements.add(bullet);
			},
		);

		this._controller.on('ship-killed', (ship: ShipController) => {
			forEachWithBreak(this._elements.values(), (element, breaker) => {
				if (element.isElementOfController(ship)) {
					element.display().destroy();
					this._elements.delete(element);
					breaker();
				}
			});
		});
	}

	tick(delta: number): void {
		this._controller.tick(delta);
		this._elements.forEach(element => {
			element.flush();
		});
	}
}
