import { Graphics } from '@pixi/graphics';
import { PI_2 } from '@pixi/math';
import ShipController, {
	SHIP_HEIGHT,
	SHIP_POLYGON,
	SHIP_WIDTH,
} from 'shared/controllers/ship';
import { BLUE, WHITE } from '../colors';
import Element from './base';

const SHIP_POLYGON_AS_NUMBERS = [];
[...SHIP_POLYGON, SHIP_POLYGON[0]].forEach(point => {
	SHIP_POLYGON_AS_NUMBERS.push(point.x, point.y);
});

export default class ShipElement extends Element<Graphics, ShipController> {
	_init() {
		const ship = new Graphics(false);

		// TODO: should check player color
		ship.beginFill(BLUE);
		ship.lineStyle(3, WHITE);
		ship.drawPolygon(SHIP_POLYGON_AS_NUMBERS);
		ship.endFill();

		return ship;
	}

	flush(): void {
		super.flush();
		this._display.rotation = this._controller.rotation * PI_2;
	}
}
