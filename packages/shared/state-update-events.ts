import { MovableState } from './controllers/types';
import { BulletState } from './controllers/bullet';
import { Direction } from './controllers/ship';
import { GameState, gameUpdators } from './controllers/game';

export enum StateEventType {
	TURN_SHIP,
	SHOOT,
}

interface ActionBase<Type extends StateEventType, Data = undefined> {
	type: Type;
	id: string;
	data?: Data;
}

export type Action =
	| ActionBase<StateEventType.TURN_SHIP, { dir: Direction }>
	| ActionBase<StateEventType.SHOOT>;

export default function updateStateFromAction(
	game: GameState,
	action: Readonly<Action>,
): null | MovableState {
	switch (action.type) {
		case StateEventType.TURN_SHIP:
			gameUpdators.updateTurnByID(game, action.id, action.data.dir);
			return null;
		case StateEventType.SHOOT:
			return gameUpdators.shoot(game, action.id);
	}
}
