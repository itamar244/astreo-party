import { Application } from '@pixi/app';
import { Container } from '@pixi/core';
import {
	BulletState,
	createRandomGame,
	Direction,
	GameState,
	gameUpdators,
	MovableState,
	updateStateFromAction,
	StateEventType,
} from 'shared/index';
import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import elementFromState from './element-from-state';
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

	addChild(element: Element) {
		this._stage.addChild(element.display());
		this._elements.add(element);
	}

	updateTurnById(shipID: string, dir: Direction) {
		updateStateFromAction(this._state, {
			type: StateEventType.TURN_SHIP,
			id: shipID,
			data: { dir },
		});
	}

	shoot(shipID: string) {
		const bulletState = updateStateFromAction(this._state, {
			type: StateEventType.SHOOT,
			id: shipID,
		});
		if (bulletState !== null) {
			this.addChild(elementFromState(bulletState));
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
			this.addChild(new ShipElement(shipState));
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
