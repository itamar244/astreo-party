import { Application } from '@pixi/app';
import { Container } from '@pixi/core';
import {
	BulletController,
	createRandomGame,
	Direction,
	GameController,
	gameUpdators,
	ShipController,
} from 'shared/index';
import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import initPlayer, { PlayerKeyOptions } from './player';

export default class Game {
	private readonly _controller: GameController;
	private readonly _elements = new Set<Element>();
	private readonly _stage: Container;

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this._controller = createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);
		this._stage = app.stage;
		this._initRound();

		for (const [i, playerKeys] of playersKeys.entries()) {
			initPlayer(i, playerKeys, this);
		}
	}

	private _initRound() {
		gameUpdators.initLivingShips(this._controller);

		for (const shipController of this._controller.ships) {
			const ship = new ShipElement(shipController);
			this._stage.addChild(ship.display());
			this._elements.add(ship);
		}
	}

	private _killShips(ships: ShipController[]) {
		for (const ship of ships) {
			for (const element of this._elements) {
				if (element.isElementOfController(ship)) {
					element.display().destroy();
					this._elements.delete(element);
					break;
				}
			}
		}
	}

	addBullet(bulletController: BulletController) {
		const bullet = new BulletElement(bulletController);
		this._stage.addChild(bullet.display());
		this._elements.add(bullet);
	}

	updateTurnById(shipID: number, dir: Direction) {
		gameUpdators.updateTurnByID(this._controller, shipID, dir);
	}

	shoot(shipID: number) {
		const bulletController = gameUpdators.shoot(this._controller, shipID);
		if (bulletController !== null) {
			this.addBullet(bulletController);
		}
	}

	tick(delta: number): void {
		this._killShips(gameUpdators.tick(this._controller, delta));

		for (const element of this._elements) {
			element.flush();
		}
	}
}
