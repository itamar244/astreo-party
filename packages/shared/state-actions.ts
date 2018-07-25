import { Direction } from './controllers/ship';

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

export type ActionInit = ActionBase<StateEventType.INIT>;
export type ActionTick = ActionBase<StateEventType.TICK, { delta: number }>;
export type ActionTurnShip = ElementActionBase<
	StateEventType.TURN_SHIP,
	{ dir: Direction }
>;
export type ActionShoot = ElementActionBase<StateEventType.SHOOT>;

export type Action = ActionInit | ActionTick | ActionTurnShip | ActionShoot;

export const createActionInit = (): ActionInit => ({
	type: StateEventType.INIT,
});

export const createActionTick = (delta: number): ActionTick => ({
	type: StateEventType.TICK,
	data: { delta },
});

export const createActionTurnShip = (
	id: string,
	dir: Direction,
): ActionTurnShip => ({
	type: StateEventType.TURN_SHIP,
	data: { id, dir },
});

export const createActionShoot = (id: string): ActionShoot => ({
	type: StateEventType.SHOOT,
	data: { id },
});

export const actions = {
	init: createActionInit,
	tick: createActionTick,
	turnShip: createActionTurnShip,
	shoot: createActionShoot,
};
