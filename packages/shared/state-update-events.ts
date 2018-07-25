import produce from 'immer';
import { MovableState } from './controllers/types';
import { BulletState } from './controllers/bullet';
import { Direction } from './controllers/ship';
import { GameState, gameUpdators } from './controllers/game';

export enum StateEventType {
	INIT,
	TICK,
	TURN_SHIP,
	SHOOT,
}

interface ActionBase<Type extends StateEventType, Data = undefined> {
	type: Type;
	data?: Data;
}

type ElementActionBase<Type extends StateEventType, Data = {}> = ActionBase<
	Type,
	Data & { id: string }
>;

export type Action =
	| ActionBase<StateEventType.INIT>
	| ActionBase<StateEventType.TICK, { delta: number }>
	| ElementActionBase<StateEventType.TURN_SHIP, { dir: Direction }>
	| ElementActionBase<StateEventType.SHOOT>;

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

export default function updateStateFromAction(
	game: GameState,
	action: Readonly<Action>,
): Update {
	let change = defaultChange;

	let next = produce(game, draft => {
		switch (action.type) {
			case StateEventType.INIT:
				gameUpdators.initLivingShips(draft);
				break;
			case StateEventType.TICK:
				change = {
					added: [],
					removed: gameUpdators.tick(draft, action.data.delta),
				};
				break;
			case StateEventType.TURN_SHIP:
				gameUpdators.updateTurnByID(draft, action.data.id, action.data.dir);
				break;
			case StateEventType.SHOOT: {
				const bulletID = gameUpdators.shoot(draft, action.data.id);

				if (bulletID !== null) {
					change = {
						added: [bulletID],
						removed: [],
					};
				}
				break;
			}
		}
	});

	return { next, change };
}
