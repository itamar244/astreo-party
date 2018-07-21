import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import { ControllerState, ControllerTypes } from 'shared/controllers/types';

export default function elementFromState(state: ControllerState): Element {
	switch (state.type) {
		case ControllerTypes.BULLET:
			return new BulletElement(this);
		case ControllerTypes.SHIP:
			return new ShipElement(this);
		default:
			throw Error(
				`${ControllerTypes[state.type]} is not a supported type for element`,
			);
	}
}
