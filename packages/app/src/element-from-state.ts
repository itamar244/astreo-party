import Element from './elements/base';
import BulletElement from './elements/bullet';
import ShipElement from './elements/ship';
import { MovableState, ControllerTypes } from 'shared/controllers/types';

export default function elementFromState(state: MovableState): Element {
	switch (state.type) {
		case ControllerTypes.BULLET:
			return new BulletElement(state);
		case ControllerTypes.SHIP:
			return new ShipElement(state);
	}
}
