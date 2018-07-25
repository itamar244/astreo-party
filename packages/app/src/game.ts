import { Application } from '@pixi/app';
import { Container } from '@pixi/core';
import {
	BulletState,
	createRandomGame,
	Direction,
	GameState,
	gameUpdators,
	gameAccessors,
	MovableState,
	updateStateFromAction,
	StateEventType,
} from 'shared/index';
import { objectEach } from 'shared/utils';
import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import elementFromState from './element-from-state';
import initPlayer, { PlayerKeyOptions } from './player';

export default class Game {
	private _state: GameState;
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

		const ships = Object.values(this._state.ships);
		for (let i = 0; i < ships.length; i++) {
			initPlayer(ships[i].id, playersKeys[i], this);
		}
	}

	addChild(element: Element) {
		this._stage.addChild(element.display());
		this._elements.add(element);
	}

	updateTurnById(shipID: string, dir: Direction) {
		this._state = updateStateFromAction(this._state, {
			type: StateEventType.TURN_SHIP,
			data: { dir, id: shipID },
		}).next;
	}

	shoot(shipID: string) {
		const { next, change } = updateStateFromAction(this._state, {
			type: StateEventType.SHOOT,
			data: { id: shipID },
		});

		this._state = next;

		for (const id of change.added) {
			this.addChild(elementFromState(gameAccessors.elementsByID(next, id)));
		}
	}

	tick(delta: number): void {
		const { next, change } = updateStateFromAction(this._state, {
			type: StateEventType.TICK,
			data: { delta },
		});
		this._removeElements(change.removed);
		this._state = next;

		for (const element of this._elements) {
			element.flush(gameAccessors.elementsByID(next, element.id));
		}
	}

	private _initRound() {
		const { next } = updateStateFromAction(this._state, {
			type: StateEventType.INIT,
		});

		this._state = next;

		objectEach(next.ships, ship => {
			this.addChild(new ShipElement(ship));
		});
	}

	private _removeElements(ids: string[]) {
		for (const id of ids) {
			for (const element of this._elements) {
				if (element.id === id) {
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
