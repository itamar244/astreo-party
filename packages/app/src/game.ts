import { Application } from '@pixi/app';
import { Container } from '@pixi/core';
import {
	BulletState,
	createRandomGame,
	Direction,
	GameState,
	gameUpdators,
	MovableState,
} from 'shared/index';
import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import initPlayer, { PlayerKeyOptions } from './player';

export default class Game {
	private readonly _state: GameState;
	private readonly _elements = new Set<Element>();
	private readonly _stage: Container;

	constructor(app: Application, playersKeys: PlayerKeyOptions[]) {
		this._state = createRandomGame(
			playersKeys.length,
			app.renderer.width,
			app.renderer.height,
		);
		this._stage = app.stage;
		this._initRound();

		const { ships } = this._state;
		for (let i = 0; i < ships.length; i++) {
			initPlayer(ships[i].id, playersKeys[i], this);
		}
	}

	addBullet(bulletState: BulletState) {
		const bullet = new BulletElement(bulletState);
		this._stage.addChild(bullet.display());
		this._elements.add(bullet);
	}

	updateTurnById(shipID: string, dir: Direction) {
		gameUpdators.updateTurnByID(this._state, shipID, dir);
	}

	shoot(shipID: string) {
		const bulletState = gameUpdators.shoot(this._state, shipID);
		if (bulletState !== null) {
			this.addBullet(bulletState);
		}
	}

	tick(delta: number): void {
		this._removeElements(gameUpdators.tick(this._state, delta));

		for (const element of this._elements) {
			element.flush();
		}
	}

	private _initRound() {
		gameUpdators.initLivingShips(this._state);

		for (const shipState of this._state.ships) {
			const ship = new ShipElement(shipState);
			this._stage.addChild(ship.display());
			this._elements.add(ship);
		}
	}

	private _removeElements(states: MovableState[]) {
		for (const state of states) {
			for (const element of this._elements) {
				if (element.isElementOfState(state)) {
					// destroying a children of stage will remove it from stage's children
					// so no extra work is needed
					element.display().destroy();
					this._elements.delete(element);
					break;
				}
			}
		}
	}
}
