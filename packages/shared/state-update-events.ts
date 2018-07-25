import produce from 'immer';
import { MovableState } from './controllers/types';
import { BulletState } from './controllers/bullet';
import { GameState, gameUpdators } from './controllers/game';
import {
	Action,
	ActionTick,
	ActionTurnShip,
	ActionShoot,
	StateEventType,
} from './state-actions';

interface UpdateChange {
	added: string[];
	removed: string[];
}

export interface Update {
	next: null | GameState;
	change: UpdateChange;
}

const defaultChange: UpdateChange = {
	added: [],
	removed: [],
};

function tick(draft: GameState, action: ActionTick) {
	return {
		added: [],
		removed: gameUpdators.tick(draft, action.data.delta),
	};
}

function turnShip(draft: GameState, action: ActionTurnShip) {
	gameUpdators.updateTurnByID(draft, action.data.id, action.data.dir);
}

function shoot(draft: GameState, action: ActionShoot) {
	const bulletID = gameUpdators.shoot(draft, action.data.id);

	// prettier-ignore
	return bulletID === null ? defaultChange : {
		added: [bulletID],
		removed: [],
	};
}

export default function updateStateFromAction(
	game: GameState,
	action: Action,
): Update {
	let change = defaultChange;

	let next = produce(game, draft => {
		switch (action.type) {
			case StateEventType.INIT:
				gameUpdators.initLivingShips(draft);
				break;
			case StateEventType.TICK:
				change = tick(draft, action);
				break;
			case StateEventType.TURN_SHIP:
				turnShip(draft, action);
				break;
			case StateEventType.SHOOT: {
				change = shoot(draft, action);
				break;
			}
		}
	});

	return { next, change };
}
