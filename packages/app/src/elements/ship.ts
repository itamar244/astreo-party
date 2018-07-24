import { Graphics } from '@pixi/graphics';
import { PI_2 } from '@pixi/math';
import {
	SHIP_HEIGHT,
	SHIP_POLYGON,
	SHIP_WIDTH,
	ShipState,
} from 'shared/controllers/ship';
import { BLUE, WHITE } from '../colors';
import Element from './base';

const SHIP_POLYGON_AS_NUMBERS = [];
[...SHIP_POLYGON, SHIP_POLYGON[0]].forEach(point => {
	SHIP_POLYGON_AS_NUMBERS.push(point.x, point.y);
});

export default class ShipElement extends Element<Graphics, ShipState> {
	_init() {
		const ship = new Graphics(false);

		// TODO: should check player color
		ship.beginFill(BLUE);
		ship.lineStyle(3, WHITE);
		ship.drawPolygon(SHIP_POLYGON_AS_NUMBERS);
		ship.endFill();

		return ship;
	}

	flush(state: ShipState): void {
		super.flush(state);
		this._display.rotation = state.rotation * PI_2;
	}
}
