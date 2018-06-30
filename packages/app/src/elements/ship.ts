import { Graphics } from '@pixi/graphics';
import { PI_2 } from '@pixi/math';
import ShipController, {
	SHIP_HEIGHT,
	SHIP_WIDTH,
} from 'shared/ship-controller';
import Element from './base';
import { BLUE, Color, WHITE } from '../colors';

// prettier-ignore
const POLYGON_DEFAULT = [
	0, +SHIP_HEIGHT / 2,
	-SHIP_WIDTH / 2, -SHIP_HEIGHT / 2,
	+SHIP_WIDTH / 2, -SHIP_HEIGHT / 2,
	0, +SHIP_HEIGHT / 2,
];

export function createShip(color: Color, initialX: number, initialY: number) {
	const ship = new Graphics(false);

	ship.beginFill(color);
	ship.lineStyle(3, WHITE);
	ship.drawPolygon(POLYGON_DEFAULT);

	ship.position.x = initialX;
	ship.position.y = initialY;

	return ship;
}

export default class ShipElement extends Element<Graphics, ShipController> {
	constructor(controller: ShipController) {
		super(createShip(BLUE, controller.x, controller.y), controller);
	}

	flush(): void {
		this._display.position.x = this._controller.x;
		this._display.position.y = this._controller.y;
		this._display.rotation = this._controller.rotation * PI_2;
	}
}
